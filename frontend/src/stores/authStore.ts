/**
 * Auth Store
 *
 * Zustand store для управления аутентификацией
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api';
import type { User, LoginCredentials, RegisterCredentials } from '../types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);

          // Сохраняем токены
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Ошибка входа',
            isLoading: false,
          });
          throw error;
        }
      },

      // Register
      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(credentials);

          // Сохраняем токены
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Ошибка регистрации',
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Очищаем state в любом случае
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Fetch current user
      fetchUser: async () => {
        const token = localStorage.getItem('access_token');
        console.log('[AuthStore] fetchUser called, has token:', !!token);

        if (!token) {
          console.log('[AuthStore] No token, setting not authenticated');
          set({ isAuthenticated: false, user: null });
          return;
        }

        console.log('[AuthStore] Starting user fetch, setting isLoading: true');
        set({ isLoading: true });
        try {
          console.log('[AuthStore] Calling authService.getCurrentUser()...');
          const user = await authService.getCurrentUser();
          console.log('[AuthStore] User fetched successfully:', user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('[AuthStore] Error fetching user:', error);
          console.error('[AuthStore] Error details:', error.response?.data);
          // Токен невалидный - очищаем
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Update user profile
      updateUser: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(data);
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Ошибка обновления профиля',
            isLoading: false,
          });
          throw error;
        }
      },

      // Set user
      setUser: (user) => {
        set({ user });
      },

      // Set tokens (for OAuth callbacks)
      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({ isAuthenticated: true });
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

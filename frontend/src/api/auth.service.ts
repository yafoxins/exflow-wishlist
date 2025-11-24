/**
 * Auth API Service
 *
 * Методы для работы с аутентификацией
 */

import apiClient from './client';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from '../types';

export const authService = {
  /**
   * Регистрация нового пользователя
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  /**
   * Вход в систему
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Получить текущего пользователя
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Обновить профиль
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/me', data);
    return response.data;
  },

  /**
   * Выход из системы
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Запросить сброс пароля
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/password-reset/request', { email });
  },

  /**
   * Подтвердить email
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { token });
  },

  /**
   * OAuth вход через Telegram
   */
  telegramAuth: async (authData: any): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/telegram', authData);
    return response.data;
  },

  /**
   * OAuth вход через Yandex
   */
  yandexAuth: async (code: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/yandex', { code });
    return response.data;
  },
};

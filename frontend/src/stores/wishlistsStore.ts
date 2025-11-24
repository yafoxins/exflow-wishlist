/**
 * Wishlists Store
 *
 * Zustand store для управления списками желаний
 */

import { create } from 'zustand';
import { wishlistsService } from '../api';
import type { Wishlist, WishlistCreate, WishlistUpdate } from '../types';

interface WishlistsState {
  // State
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWishlists: () => Promise<void>;
  fetchWishlist: (id: number) => Promise<void>;
  fetchPublicWishlist: (id: number) => Promise<void>;
  createWishlist: (data: WishlistCreate) => Promise<Wishlist>;
  updateWishlist: (id: number, data: WishlistUpdate) => Promise<void>;
  deleteWishlist: (id: number) => Promise<void>;
  clearError: () => void;
  setCurrentWishlist: (wishlist: Wishlist | null) => void;
}

export const useWishlistsStore = create<WishlistsState>((set, get) => ({
  // Initial state
  wishlists: [],
  currentWishlist: null,
  isLoading: false,
  error: null,

  // Fetch all wishlists
  fetchWishlists: async () => {
    set({ isLoading: true, error: null });
    try {
      const wishlists = await wishlistsService.getAll();
      set({ wishlists, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка загрузки списков',
        isLoading: false,
      });
    }
  },

  // Fetch single wishlist
  fetchWishlist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const wishlist = await wishlistsService.getById(id);
      set({ currentWishlist: wishlist, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка загрузки списка',
        isLoading: false,
      });
    }
  },

  // Fetch public wishlist
  fetchPublicWishlist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const wishlist = await wishlistsService.getPublic(id);
      set({ currentWishlist: wishlist, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Список не найден',
        isLoading: false,
      });
    }
  },

  // Create wishlist
  createWishlist: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newWishlist = await wishlistsService.create(data);
      set((state) => ({
        wishlists: [...state.wishlists, newWishlist],
        isLoading: false,
      }));
      return newWishlist;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка создания списка',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update wishlist
  updateWishlist: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedWishlist = await wishlistsService.update(id, data);
      set((state) => ({
        wishlists: state.wishlists.map((w) =>
          w.id === id ? updatedWishlist : w
        ),
        currentWishlist:
          state.currentWishlist?.id === id ? updatedWishlist : state.currentWishlist,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка обновления списка',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete wishlist
  deleteWishlist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await wishlistsService.delete(id);
      set((state) => ({
        wishlists: state.wishlists.filter((w) => w.id !== id),
        currentWishlist:
          state.currentWishlist?.id === id ? null : state.currentWishlist,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка удаления списка',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set current wishlist
  setCurrentWishlist: (wishlist) => set({ currentWishlist: wishlist }),
}));

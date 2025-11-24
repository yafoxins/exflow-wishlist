/**
 * Items Store
 *
 * Zustand store для управления подарками
 */

import { create } from 'zustand';
import { itemsService } from '../api';
import type { WishlistItem, ItemCreate, ItemUpdate } from '../types';

interface ItemsState {
  // State
  items: WishlistItem[];
  currentItem: WishlistItem | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchItems: (wishlistId: number) => Promise<void>;
  fetchItem: (id: number) => Promise<void>;
  createItem: (wishlistId: number, data: ItemCreate) => Promise<WishlistItem>;
  updateItem: (id: number, data: ItemUpdate) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  updatePriority: (id: number, priority: 'low' | 'medium' | 'high') => Promise<void>;
  clearError: () => void;
  setCurrentItem: (item: WishlistItem | null) => void;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  // Initial state
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,

  // Fetch items for wishlist
  fetchItems: async (wishlistId) => {
    set({ isLoading: true, error: null });
    try {
      const items = await itemsService.getByWishlist(wishlistId);
      set({ items, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка загрузки подарков',
        isLoading: false,
      });
    }
  },

  // Fetch single item
  fetchItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const item = await itemsService.getById(id);
      set({ currentItem: item, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка загрузки подарка',
        isLoading: false,
      });
    }
  },

  // Create item
  createItem: async (wishlistId, data) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await itemsService.create(wishlistId, data);
      set((state) => ({
        items: [...state.items, newItem],
        isLoading: false,
      }));
      return newItem;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка добавления подарка',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update item
  updateItem: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await itemsService.update(id, data);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
        currentItem:
          state.currentItem?.id === id ? updatedItem : state.currentItem,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка обновления подарка',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete item
  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await itemsService.delete(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        currentItem: state.currentItem?.id === id ? null : state.currentItem,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка удаления подарка',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update priority
  updatePriority: async (id, priority) => {
    await get().updateItem(id, { priority });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set current item
  setCurrentItem: (item) => set({ currentItem: item }),
}));

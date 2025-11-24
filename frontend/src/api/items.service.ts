/**
 * Items API Service
 *
 * Методы для работы с подарками
 */

import apiClient from './client';
import type { WishlistItem, ItemCreate, ItemUpdate } from '../types';

export const itemsService = {
  /**
   * Получить все подарки из списка
   */
  getByWishlist: async (wishlistId: number): Promise<WishlistItem[]> => {
    const response = await apiClient.get<WishlistItem[]>(`/items/wishlist/${wishlistId}`);
    return response.data;
  },

  /**
   * Получить конкретный подарок
   */
  getById: async (id: number): Promise<WishlistItem> => {
    const response = await apiClient.get<WishlistItem>(`/items/${id}`);
    return response.data;
  },

  /**
   * Добавить подарок в список
   */
  create: async (wishlistId: number, data: ItemCreate): Promise<WishlistItem> => {
    const response = await apiClient.post<WishlistItem>('/items/', {
      ...data,
      wishlist_id: wishlistId,
    });
    return response.data;
  },

  /**
   * Обновить подарок
   */
  update: async (id: number, data: ItemUpdate): Promise<WishlistItem> => {
    const response = await apiClient.put<WishlistItem>(`/items/${id}`, data);
    return response.data;
  },

  /**
   * Удалить подарок
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
  },

  /**
   * Изменить приоритет подарка
   */
  updatePriority: async (
    id: number,
    priority: 'low' | 'medium' | 'high'
  ): Promise<WishlistItem> => {
    return itemsService.update(id, { priority });
  },

  /**
   * Изменить статус подарка
   */
  updateStatus: async (
    id: number,
    status: 'available' | 'reserved' | 'purchased'
  ): Promise<WishlistItem> => {
    return itemsService.update(id, { status });
  },
};

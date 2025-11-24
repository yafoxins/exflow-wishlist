/**
 * Wishlists API Service
 *
 * Методы для работы со списками желаний
 */

import apiClient from './client';
import type { Wishlist, WishlistCreate, WishlistUpdate } from '../types';

export const wishlistsService = {
  /**
   * Получить все списки текущего пользователя
   */
  getAll: async (): Promise<Wishlist[]> => {
    const response = await apiClient.get<Wishlist[]>('/wishlists/');
    return response.data;
  },

  /**
   * Получить конкретный список по ID
   */
  getById: async (id: number): Promise<Wishlist> => {
    const response = await apiClient.get<Wishlist>(`/wishlists/${id}`);
    return response.data;
  },

  /**
   * Получить публичный список (без авторизации)
   */
  getPublic: async (id: number): Promise<Wishlist> => {
    const response = await apiClient.get<Wishlist>(`/wishlists/public/${id}`);
    return response.data;
  },

  /**
   * Получить список по username и ID (публичная ссылка)
   */
  getByUsername: async (username: string, id: number): Promise<Wishlist> => {
    const response = await apiClient.get<Wishlist>(`/wishlists/u/${username}/${id}`);
    return response.data;
  },

  /**
   * Создать новый список
   */
  create: async (data: WishlistCreate): Promise<Wishlist> => {
    const response = await apiClient.post<Wishlist>('/wishlists/', data);
    return response.data;
  },

  /**
   * Обновить список
   */
  update: async (id: number, data: WishlistUpdate): Promise<Wishlist> => {
    const response = await apiClient.patch<Wishlist>(`/wishlists/${id}`, data);
    return response.data;
  },

  /**
   * Удалить список
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/wishlists/${id}`);
  },

  /**
   * Получить статистику списка
   */
  getStats: async (id: number): Promise<{
    total_items: number;
    reserved_items: number;
    total_price: number;
  }> => {
    const response = await apiClient.get(`/wishlists/${id}/stats`);
    return response.data;
  },
};

/**
 * Users API Service
 *
 * Методы для работы с профилем пользователя
 */

import apiClient from './client';
import type { User } from '../types';

export interface UserUpdate {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  birth_date?: string;
}

export const usersService = {
  /**
   * Обновить профиль текущего пользователя
   */
  updateMe: async (data: UserUpdate): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/me', data);
    return response.data;
  },

  /**
   * Удалить аккаунт текущего пользователя
   */
  deleteMe: async (): Promise<void> => {
    await apiClient.delete('/auth/me');
  },
};

/**
 * Reservations API Service
 *
 * Методы для работы с бронированиями подарков
 */

import apiClient from './client';
import type { Reservation, ReservationCreate } from '../types';

export const reservationsService = {
  /**
   * Создать бронирование подарка
   */
  create: async (data: ReservationCreate): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>('/reservations/', data);
    return response.data;
  },

  /**
   * Отменить бронирование
   */
  cancel: async (reservationId: number): Promise<void> => {
    await apiClient.delete(`/reservations/${reservationId}`);
  },

  /**
   * Обновить бронирование
   */
  update: async (reservationId: number, data: Partial<ReservationCreate>): Promise<Reservation> => {
    const response = await apiClient.patch<Reservation>(`/reservations/${reservationId}`, data);
    return response.data;
  },
};

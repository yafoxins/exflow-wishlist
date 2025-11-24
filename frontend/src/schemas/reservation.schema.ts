/**
 * Reservation Validation Schemas
 *
 * Zod схемы для валидации бронирований
 */

import { z } from 'zod';

export const reservationSchema = z.object({
  guest_name: z
    .string()
    .min(1, 'Имя обязательно')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .optional(),

  guest_email: z
    .string()
    .email('Некорректный email')
    .optional()
    .or(z.literal('')),

  comment: z
    .string()
    .max(500, 'Комментарий слишком длинный (макс. 500 символов)')
    .optional(),

  is_anonymous: z.boolean().default(false),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

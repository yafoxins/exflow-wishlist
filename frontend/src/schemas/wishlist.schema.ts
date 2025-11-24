/**
 * Wishlist Validation Schemas
 *
 * Zod схемы для валидации списков желаний
 */

import { z } from 'zod';

export const wishlistSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обязательно')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название слишком длинное (макс. 100 символов)'),

  description: z
    .string()
    .max(500, 'Описание слишком длинное (макс. 500 символов)')
    .optional(),

  emoji: z
    .string()
    .max(10, 'Слишком много emoji')
    .optional(),

  event_date: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }, 'Дата события не может быть в прошлом'),

  access_type: z.enum(['private', 'by_link', 'public'], {
    errorMap: () => ({ message: 'Выберите тип доступа' }),
  }),

  allow_reservations: z.boolean().default(true),
});

export type WishlistFormData = z.infer<typeof wishlistSchema>;

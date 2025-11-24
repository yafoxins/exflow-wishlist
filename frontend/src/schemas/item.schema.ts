/**
 * Item Validation Schemas
 *
 * Zod схемы для валидации подарков
 */

import { z } from 'zod';

export const itemSchema = z.object({
  title: z
    .string()
    .min(1, 'Название подарка обязательно')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(200, 'Название слишком длинное (макс. 200 символов)'),

  description: z
    .string()
    .max(1000, 'Описание слишком длинное (макс. 1000 символов)')
    .optional(),

  price: z
    .number()
    .min(0, 'Цена не может быть отрицательной')
    .max(10000000, 'Цена слишком большая')
    .optional()
    .nullable(),

  link: z
    .string()
    .url('Некорректная ссылка')
    .optional()
    .or(z.literal('')),

  image_url: z
    .string()
    .url('Некорректная ссылка на изображение')
    .optional()
    .or(z.literal('')),

  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Выберите приоритет' }),
  }).default('medium'),

  status: z
    .enum(['available', 'reserved', 'purchased'])
    .default('available'),
});

export type ItemFormData = z.infer<typeof itemSchema>;

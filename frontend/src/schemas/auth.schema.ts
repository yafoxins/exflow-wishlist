/**
 * Auth Validation Schemas
 *
 * Zod схемы для валидации аутентификации
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),

  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, 'Имя обязательно')
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(100, 'Имя слишком длинное'),

    email: z
      .string()
      .min(1, 'Email обязателен')
      .email('Некорректный email'),

    password: z
      .string()
      .min(1, 'Пароль обязателен')
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Пароль должен содержать заглавные и строчные буквы, и цифры'
      ),

    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .optional(),

  email: z.string().email('Некорректный email').optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

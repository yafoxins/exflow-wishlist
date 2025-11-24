/**
 * Form Hook
 *
 * Кастомный хук для работы с формами (react-hook-form + zod)
 */

import { useForm as useHookForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Typed useForm hook с Zod валидацией
 */
export function useForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
): UseFormReturn<z.infer<TSchema>> {
  return useHookForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });
}

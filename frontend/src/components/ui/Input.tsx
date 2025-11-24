/**
 * Input Component
 *
 * Текстовое поле с поддержкой различных состояний, иконок и валидации.
 * Может использоваться как обычный input или textarea.
 *
 * @example
 * <Input
 *   label="Название списка"
 *   placeholder="Мой список желаний"
 *   value={title}
 *   onChange={(e) => setTitle(e.target.value)}
 *   error={errors.title}
 *   leftIcon={<ListIcon />}
 * />
 */

import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Метка поля */
  label?: string;
  /** Текст ошибки */
  error?: string;
  /** Подсказка под полем */
  helperText?: string;
  /** Иконка слева */
  leftIcon?: React.ReactNode;
  /** Иконка справа */
  rightIcon?: React.ReactNode;
  /** Полная ширина */
  fullWidth?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Метка поля */
  label?: string;
  /** Текст ошибки */
  error?: string;
  /** Подсказка под полем */
  helperText?: string;
  /** Полная ширина */
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Метка */}
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Контейнер с иконками */}
        <div className="relative">
          {/* Левая иконка */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Поле ввода */}
          <input
            ref={ref}
            className={cn(
              // Базовые стили
              'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200',
              'text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',

              // Стили в зависимости от состояния
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-gray-300',

              // Отступы для иконок
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',

              // Стили disabled
              props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : '',

              className
            )}
            {...props}
          />

          {/* Правая иконка */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Текст ошибки или подсказка */}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Метка */}
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            // Базовые стили
            'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'resize-y',

            // Стили в зависимости от состояния
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-gray-300',

            // Стили disabled
            props.disabled && 'bg-gray-50 cursor-not-allowed opacity-60',

            className
          )}
          {...props}
        />

        {/* Текст ошибки или подсказка */}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;

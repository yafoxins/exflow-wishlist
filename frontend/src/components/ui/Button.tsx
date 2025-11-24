/**
 * Button Component
 *
 * Универсальная кнопка с поддержкой различных вариантов оформления,
 * размеров и состояний. Следует дизайн-системе проекта.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Создать список
 * </Button>
 */

import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант оформления кнопки */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg';
  /** Полная ширина */
  fullWidth?: boolean;
  /** Состояние загрузки */
  isLoading?: boolean;
  /** Иконка слева */
  leftIcon?: React.ReactNode;
  /** Иконка справа */
  rightIcon?: React.ReactNode;
  /** Дочерние элементы */
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Базовые стили (всегда применяются)
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    // Варианты оформления
    const variantStyles = {
      primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-purple-500',
      secondary: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-orange-500',
      outline: 'border-2 border-indigo-500 text-indigo-700 bg-white hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400',
      danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg active:scale-[0.98] focus:ring-red-500',
    };

    // Размеры
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    };

    // Стили для состояния disabled
    const disabledStyles = 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none';

    // Стили для состояния loading
    const loadingStyles = 'cursor-wait opacity-75';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          (disabled || isLoading) && disabledStyles,
          isLoading && loadingStyles,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Индикатор загрузки */}
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Левая иконка */}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}

        {/* Текст кнопки */}
        {children && <span>{children}</span>}

        {/* Правая иконка */}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

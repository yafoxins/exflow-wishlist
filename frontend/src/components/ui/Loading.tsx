/**
 * Loading Components
 *
 * Компоненты для отображения состояния загрузки.
 * Включает спиннеры, скелетоны, индикаторы прогресса.
 *
 * @example
 * <Spinner size="lg" />
 * <Skeleton count={3} />
 * <PageLoader message="Загружаем ваши списки..." />
 */

import React from 'react';
import { cn } from '../../utils/cn';

interface SpinnerProps {
  /** Размер спиннера */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Цвет */
  variant?: 'primary' | 'white' | 'gray';
  /** CSS классы */
  className?: string;
}

/**
 * Спиннер загрузки
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantStyles = {
    primary: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <svg
      className={cn(
        'animate-spin',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
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
  );
};

interface PageLoaderProps {
  /** Сообщение под спиннером */
  message?: string;
  /** CSS классы */
  className?: string;
}

/**
 * Полноэкранный загрузчик страницы
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Загрузка...',
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-screen', className)}>
      <div className="relative">
        {/* Декоративный градиентный круг */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        </div>

        {/* Спиннер */}
        <Spinner size="xl" className="relative" />
      </div>

      {message && (
        <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

interface SkeletonProps {
  /** Количество строк */
  count?: number;
  /** Высота элемента */
  height?: string;
  /** CSS классы */
  className?: string;
}

/**
 * Скелетон для загружаемого контента
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  height = 'h-4',
  className,
}) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg',
            'bg-[length:200%_100%] animate-shimmer',
            height,
            className
          )}
        />
      ))}
    </div>
  );
};

/**
 * Скелетон карточки
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <div className="h-8 bg-gray-200 rounded-full w-20" />
        <div className="h-8 bg-gray-200 rounded-full w-24" />
      </div>
    </div>
  );
};

export default Spinner;

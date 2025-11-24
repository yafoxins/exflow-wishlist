/**
 * Badge Component
 *
 * Компактный элемент для отображения статусов, тегов, счётчиков.
 * Поддерживает различные цветовые схемы и размеры.
 *
 * @example
 * <Badge variant="success">Оплачен</Badge>
 * <Badge variant="warning" size="sm">Ожидает</Badge>
 * <Badge variant="info" dot>3 новых</Badge>
 */

import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  /** Вариант оформления */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Размер */
  size?: 'sm' | 'md' | 'lg';
  /** Показать точку слева */
  dot?: boolean;
  /** Дочерние элементы */
  children: React.ReactNode;
  /** CSS классы */
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}) => {
  // Варианты цветов
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-indigo-100 text-indigo-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  // Цвета точек
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-indigo-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  // Размеры
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={cn('rounded-full', dotColors[variant], dotSizes[size])} />
      )}
      {children}
    </span>
  );
};

export default Badge;

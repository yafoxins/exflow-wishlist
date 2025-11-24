/**
 * Avatar Component
 *
 * Компонент аватара пользователя с поддержкой изображения,
 * инициалов, различных размеров и статусов.
 *
 * @example
 * <Avatar
 *   src={user.avatar}
 *   name={user.name}
 *   size="lg"
 *   status="online"
 * />
 */

import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps {
  /** URL изображения */
  src?: string;
  /** Имя пользователя (для инициалов) */
  name?: string;
  /** Размер аватара */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Статус пользователя */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Форма аватара */
  shape?: 'circle' | 'rounded' | 'square';
  /** CSS классы */
  className?: string;
  /** Alt текст для изображения */
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  status,
  shape = 'circle',
  className,
  alt,
}) => {
  // Размеры
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  // Формы
  const shapeStyles = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none',
  };

  // Размеры индикатора статуса
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  // Цвета статусов
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  };

  // Получаем инициалы из имени
  const getInitials = (name: string): string => {
    if (!name) return '?';

    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="relative inline-block">
      {src ? (
        // Аватар с изображением
        <img
          src={src}
          alt={alt || name}
          className={cn(
            'object-cover border-2 border-white shadow-sm',
            sizeStyles[size],
            shapeStyles[shape],
            className
          )}
        />
      ) : (
        // Аватар с инициалами
        <div
          className={cn(
            'flex items-center justify-center font-semibold text-white',
            'bg-gradient-to-br from-indigo-500 to-purple-500',
            'border-2 border-white shadow-sm',
            sizeStyles[size],
            shapeStyles[shape],
            className
          )}
        >
          {initials}
        </div>
      )}

      {/* Индикатор статуса */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

/**
 * Группа аватаров (стопкой)
 */
interface AvatarGroupProps {
  /** Массив пользователей */
  users: Array<{
    src?: string;
    name: string;
  }>;
  /** Максимальное количество видимых аватаров */
  max?: number;
  /** Размер аватаров */
  size?: AvatarProps['size'];
  /** CSS классы */
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = 'md',
  className,
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visibleUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.src}
          name={user.name}
          size={size}
          className="ring-2 ring-white hover:z-10 transition-all hover:scale-110"
        />
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center font-semibold text-gray-600',
            'bg-gray-200 ring-2 ring-white',
            'rounded-full',
            size === 'xs' && 'w-6 h-6 text-xs',
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-10 h-10 text-sm',
            size === 'lg' && 'w-12 h-12 text-base',
            size === 'xl' && 'w-16 h-16 text-lg',
            size === '2xl' && 'w-24 h-24 text-2xl'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;

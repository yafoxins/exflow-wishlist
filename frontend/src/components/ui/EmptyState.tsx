/**
 * EmptyState Component
 *
 * Красивое пустое состояние для списков, поиска, ошибок.
 * Показывает emoji, заголовок, описание и опциональный CTA.
 *
 * @example
 * <EmptyState
 *   emoji="🎁"
 *   title="У вас пока нет списков"
 *   description="Создайте свой первый список желаний и начните собирать подарки мечты"
 *   action={
 *     <Button onClick={handleCreate}>Создать список</Button>
 *   }
 * />
 */

import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  /** Emoji иконка */
  emoji?: string;
  /** Заголовок */
  title: string;
  /** Описание */
  description?: string;
  /** Действие (кнопка или элемент) */
  action?: React.ReactNode;
  /** Размер */
  size?: 'sm' | 'md' | 'lg';
  /** CSS классы */
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '📋',
  title,
  description,
  action,
  size = 'md',
  className,
}) => {
  // Размеры
  const sizeStyles = {
    sm: {
      emoji: 'text-6xl',
      title: 'text-lg',
      description: 'text-sm',
      padding: 'py-8',
    },
    md: {
      emoji: 'text-8xl',
      title: 'text-2xl',
      description: 'text-base',
      padding: 'py-12',
    },
    lg: {
      emoji: 'text-9xl',
      title: 'text-3xl',
      description: 'text-lg',
      padding: 'py-16',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        styles.padding,
        className
      )}
    >
      {/* Декоративный фон */}
      <div className="relative">
        {/* Градиентные круги на фоне */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        </div>

        {/* Emoji */}
        <div className={cn('relative mb-6', styles.emoji)}>
          {emoji}
        </div>
      </div>

      {/* Контент */}
      <div className="space-y-3 max-w-md">
        {/* Заголовок */}
        <h3 className={cn('font-bold text-gray-900', styles.title)}>
          {title}
        </h3>

        {/* Описание */}
        {description && (
          <p className={cn('text-gray-600 leading-relaxed', styles.description)}>
            {description}
          </p>
        )}
      </div>

      {/* Действие */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * Специализированные варианты EmptyState
 */

/** Пустой список */
export const EmptyList: React.FC<Omit<EmptyStateProps, 'emoji'>> = (props) => (
  <EmptyState emoji="📋" {...props} />
);

/** Поиск не дал результатов */
export const EmptySearch: React.FC<Omit<EmptyStateProps, 'emoji' | 'title'>> = (props) => (
  <EmptyState
    emoji="🔍"
    title="Ничего не найдено"
    {...props}
  />
);

/** Ошибка загрузки */
export const ErrorState: React.FC<Omit<EmptyStateProps, 'emoji' | 'title'>> = (props) => (
  <EmptyState
    emoji="😔"
    title="Что-то пошло не так"
    {...props}
  />
);

/** Нет подключения */
export const OfflineState: React.FC<Omit<EmptyStateProps, 'emoji' | 'title'>> = (props) => (
  <EmptyState
    emoji="📡"
    title="Нет подключения"
    description="Проверьте интернет-соединение и попробуйте снова"
    {...props}
  />
);

export default EmptyState;

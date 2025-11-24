/**
 * Card Component
 *
 * Универсальная карточка для отображения списков желаний и подарков.
 * Поддерживает различные варианты оформления, hover-эффекты и кликабельность.
 *
 * @example
 * // Карточка списка желаний
 * <WishlistCard
 *   title="День рождения 2025"
 *   description="Мои мечты на 30 лет"
 *   itemCount={12}
 *   eventDate="2025-06-15"
 *   gradient="from-purple-500 to-pink-500"
 *   onClick={() => navigate('/wishlist/123')}
 * />
 *
 * // Карточка подарка
 * <ItemCard
 *   title="iPhone 15 Pro"
 *   price={99990}
 *   imageUrl="https://..."
 *   priority="high"
 *   isReserved={false}
 *   onClick={() => viewItem(item)}
 * />
 */

import React from 'react';
import { cn } from '../../utils/cn';

interface BaseCardProps {
  /** CSS классы */
  className?: string;
  /** Обработчик клика */
  onClick?: () => void;
  /** Дочерние элементы */
  children: React.ReactNode;
}

/**
 * Базовая карточка
 */
export const Card: React.FC<BaseCardProps> = ({ className, onClick, children }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border-2 border-gray-100 shadow-sm transition-all duration-300',
        onClick && 'cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:border-indigo-200 active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
};

interface WishlistCardProps {
  /** Название списка */
  title: string;
  /** Описание списка */
  description?: string;
  /** Количество подарков */
  itemCount: number;
  /** Дата события (опционально) */
  eventDate?: string;
  /** Градиент для emoji-контейнера */
  gradient?: string;
  /** Emoji иконка */
  emoji?: string;
  /** Обработчик клика */
  onClick?: () => void;
  /** Публичный доступ */
  isPublic?: boolean;
  /** Обработчик удаления */
  onDelete?: () => void;
}

/**
 * Карточка списка желаний
 */
export const WishlistCard: React.FC<WishlistCardProps> = ({
  title,
  description,
  itemCount,
  eventDate,
  gradient = 'from-indigo-500 to-purple-500',
  emoji = '🎁',
  onClick,
  isPublic = false,
  onDelete,
}) => {
  // Форматируем дату
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Вычисляем дни до события
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDay = new Date(dateString);
    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = eventDate ? getDaysUntil(eventDate) : null;

  return (
    <Card onClick={onClick} className="group overflow-hidden">
      {/* Header с градиентом */}
      <div className={cn('bg-gradient-to-r p-6 relative overflow-hidden', gradient)}>
        {/* Декоративные элементы */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            title="Удалить список"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* Emoji */}
        <div className="relative text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </div>

        {/* Название */}
        <h3 className="relative text-2xl font-bold text-white mb-1">{title}</h3>

        {/* Описание */}
        {description && (
          <p className="relative text-white/90 text-sm line-clamp-2">{description}</p>
        )}
      </div>

      {/* Body с информацией */}
      <div className="p-6 space-y-3">
        {/* Количество подарков */}
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <span className="text-sm font-medium">
            {itemCount} {itemCount === 1 ? 'подарок' : itemCount < 5 ? 'подарка' : 'подарков'}
          </span>
        </div>

        {/* Дата события */}
        {eventDate && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">
              {formatDate(eventDate)}
              {daysUntil !== null && daysUntil >= 0 && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
                </span>
              )}
            </span>
          </div>
        )}

        {/* Публичный доступ */}
        {isPublic && (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">Публичный доступ</span>
          </div>
        )}
      </div>
    </Card>
  );
};

interface ItemCardProps {
  /** Название подарка */
  title: string;
  /** Цена */
  price?: number;
  /** URL изображения */
  imageUrl?: string;
  /** Приоритет (low, medium, high) */
  priority?: 'low' | 'medium' | 'high';
  /** Статус подарка */
  status?: 'available' | 'reserved' | 'purchased';
  /** Забронирован ли (deprecated, используйте status) */
  isReserved?: boolean;
  /** Ссылка на товар */
  link?: string;
  /** Обработчик клика */
  onClick?: () => void;
  /** Компактный вид */
  compact?: boolean;
}

/**
 * Карточка подарка
 */
export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  price,
  imageUrl,
  priority,
  status = 'available',
  isReserved = false,
  link,
  onClick,
  compact = false,
}) => {
  // Обратная совместимость с isReserved
  const itemStatus = status || (isReserved ? 'reserved' : 'available');

  // Цвета приоритетов
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-red-100 text-red-700',
  };

  const priorityLabels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
  };

  // Метки статусов
  const statusLabels = {
    available: '',
    reserved: 'Забронирован',
    purchased: 'Куплен',
  };

  // Цвета статусов
  const statusColors = {
    available: '',
    reserved: 'bg-orange-100 text-orange-700',
    purchased: 'bg-green-100 text-green-700',
  };

  // Форматируем цену
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (compact) {
    // Компактная версия для списков
    return (
      <Card onClick={onClick} className="group">
        <div className="flex items-center gap-4 p-4">
          {/* Изображение или плейсхолдер */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl flex-shrink-0">
              🎁
            </div>
          )}

          {/* Информация */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
            {price && (
              <p className="text-sm text-gray-600 mt-0.5">{formatPrice(price)}</p>
            )}
          </div>

          {/* Статус */}
          {itemStatus !== 'available' && (
            <div className={cn(
              'flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full',
              statusColors[itemStatus]
            )}>
              {statusLabels[itemStatus]}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Полная версия карточки
  return (
    <Card onClick={onClick} className="group overflow-hidden">
      {/* Изображение */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">
            🎁
          </div>
        )}

        {/* Оверлей при бронировании/покупке */}
        {itemStatus !== 'available' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">
                {statusLabels[itemStatus]}
              </span>
            </div>
          </div>
        )}

        {/* Бейдж приоритета */}
        {priority && itemStatus === 'available' && (
          <div className={cn(
            'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
            priorityColors[priority]
          )}>
            {priorityLabels[priority]}
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-5 space-y-3">
        {/* Название */}
        <h4 className="font-bold text-gray-900 text-lg line-clamp-2 leading-snug">
          {title}
        </h4>

        {/* Цена */}
        {price && (
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {formatPrice(price)}
          </div>
        )}

        {/* Ссылка на товар */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Открыть в магазине
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </Card>
  );
};

export default Card;

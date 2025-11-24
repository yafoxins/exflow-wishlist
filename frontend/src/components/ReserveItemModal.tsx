/**
 * Reserve Item Modal
 * Модальное окно для бронирования подарка
 */

import React, { useState } from 'react';
import { Button, Input } from './ui';
import type { ReservationCreate, WishlistItem } from '../types';

interface ReserveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservationCreate) => Promise<void>;
  item: WishlistItem | null;
}

export const ReserveItemModal: React.FC<ReserveItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item
}) => {
  const [formData, setFormData] = useState<Omit<ReservationCreate, 'item_id'>>({
    guest_name: '',
    guest_email: '',
    comment: '',
    is_anonymous: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    try {
      setIsLoading(true);
      setError('');
      await onSubmit({
        item_id: item.id,
        ...formData
      });

      // Сброс формы
      setFormData({
        guest_name: '',
        guest_email: '',
        comment: '',
        is_anonymous: false
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка бронирования подарка');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  // Форматируем цену
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Забронировать подарок</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Информация о подарке */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <div className="flex gap-4">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center text-4xl flex-shrink-0">
                  🎁
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                {item.price && (
                  <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(item.price)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Пояснение */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Что такое бронирование?</p>
                <p>
                  Бронирование позволяет вам "застолбить" подарок, чтобы другие гости не дарили то же самое.
                  Владелец списка увидит, что подарок забронирован, но не будет знать, кто именно его забронировал
                  (если вы выберете анонимное бронирование).
                </p>
              </div>
            </div>
          </div>

          {/* Имя (опционально) */}
          <div>
            <Input
              label="Ваше имя (опционально)"
              value={formData.guest_name || ''}
              onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
              placeholder="Иван Иванов"
              fullWidth
              helperText="Будет видно владельцу списка, если не включена анонимность"
            />
          </div>

          {/* Email (опционально) */}
          <div>
            <Input
              label="Email (опционально)"
              type="email"
              value={formData.guest_email || ''}
              onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
              placeholder="ivan@example.com"
              fullWidth
              helperText="Для получения напоминаний"
            />
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Комментарий (опционально)
            </label>
            <textarea
              value={formData.comment || ''}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Например: Куплю синего цвета, размер M"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Анонимность */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded mt-0.5"
              />
              <div>
                <div className="font-medium text-gray-900">Анонимное бронирование</div>
                <div className="text-sm text-gray-500">
                  Владелец списка не узнает ваше имя и email
                </div>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              fullWidth
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Бронирование...' : 'Забронировать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReserveItemModal;

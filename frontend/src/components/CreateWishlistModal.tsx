/**
 * Create Wishlist Modal
 * Модальное окно для создания нового списка желаний
 */

import React, { useState } from 'react';
import { Button, Input } from './ui';
import type { WishlistCreate } from '../types';

interface CreateWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WishlistCreate) => Promise<void>;
}

const emojiOptions = [
  '🎂', '🎄', '💍', '✈️', '🎁', '🎉', '🎈', '🎊',
  '🏠', '🚗', '📚', '🎮', '💻', '📱', '⚽', '🎸',
  '🎨', '🎭', '🎪', '🎬', '📷', '🎵', '🎤', '🎧'
];

export const CreateWishlistModal: React.FC<CreateWishlistModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<WishlistCreate>({
    title: '',
    description: '',
    emoji: '🎁',
    event_date: undefined,
    access_type: 'private',
    allow_reservations: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Укажите название списка');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await onSubmit(formData);

      // Сброс формы
      setFormData({
        title: '',
        description: '',
        emoji: '🎁',
        event_date: undefined,
        access_type: 'private',
        allow_reservations: true
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка создания списка');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Создать список желаний</h2>
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

          {/* Название */}
          <div>
            <Input
              label="Название списка *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="День рождения 2025"
              required
              fullWidth
              maxLength={100}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Мои мечты и желания..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите иконку
            </label>
            <div className="grid grid-cols-8 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji })}
                  className={`text-3xl p-3 rounded-xl transition hover:scale-110 ${
                    formData.emoji === emoji
                      ? 'bg-indigo-100 ring-2 ring-indigo-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Дата события */}
          <div>
            <Input
              label="Дата события (опционально)"
              type="date"
              value={formData.event_date || ''}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value || undefined })}
              fullWidth
              helperText="Например, день рождения или Новый год"
            />
          </div>

          {/* Настройки доступа */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Кто может видеть список?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="access_type"
                  value="private"
                  checked={formData.access_type === 'private'}
                  onChange={(e) => setFormData({ ...formData, access_type: e.target.value as any })}
                  className="w-4 h-4 text-indigo-600"
                />
                <div>
                  <div className="font-medium text-gray-900">🔒 Только я</div>
                  <div className="text-sm text-gray-500">Никто кроме вас не увидит список</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="access_type"
                  value="by_link"
                  checked={formData.access_type === 'by_link'}
                  onChange={(e) => setFormData({ ...formData, access_type: e.target.value as any })}
                  className="w-4 h-4 text-indigo-600"
                />
                <div>
                  <div className="font-medium text-gray-900">🔗 По ссылке</div>
                  <div className="text-sm text-gray-500">Только те, у кого есть ссылка</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="access_type"
                  value="public"
                  checked={formData.access_type === 'public'}
                  onChange={(e) => setFormData({ ...formData, access_type: e.target.value as any })}
                  className="w-4 h-4 text-indigo-600"
                />
                <div>
                  <div className="font-medium text-gray-900">🌐 Публичный</div>
                  <div className="text-sm text-gray-500">Список доступен всем в интернете</div>
                </div>
              </label>
            </div>
          </div>

          {/* Разрешить бронирование */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allow_reservations}
                onChange={(e) => setFormData({ ...formData, allow_reservations: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Разрешить бронирование подарков</div>
                <div className="text-sm text-gray-500">
                  Гости смогут забронировать подарки, чтобы избежать дубликатов
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
              disabled={isLoading || !formData.title.trim()}
              fullWidth
            >
              {isLoading ? 'Создание...' : 'Создать список'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWishlistModal;

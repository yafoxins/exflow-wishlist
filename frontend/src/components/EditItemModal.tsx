/**
 * Edit Item Modal
 * Модальное окно для редактирования подарка
 */

import React, { useState, useEffect } from 'react';
import { Button, Input } from './ui';
import { parserService } from '../api/parser.service';
import type { WishlistItem, ItemUpdate } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: ItemUpdate) => Promise<void>;
  item: WishlistItem | null;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item
}) => {
  const [formData, setFormData] = useState<ItemUpdate>({
    title: '',
    description: '',
    link: '',
    price: undefined,
    image_url: '',
    priority: 'medium',
    status: 'available',
    marketplace: 'other',
    tags: [],
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');

  const handleParseUrl = async () => {
    const url = formData.link?.trim();
    if (!url) {
      setError('Введите ссылку на товар');
      return;
    }

    try {
      setIsParsing(true);
      setError('');
      const parsed = await parserService.parseProduct(url);

      if (parsed.success) {
        setFormData({
          ...formData,
          title: parsed.title || formData.title,
          description: parsed.description || formData.description,
          price: parsed.price || formData.price,
          image_url: parsed.image_url || formData.image_url,
          images: parsed.images || formData.images,
          marketplace: (parsed.marketplace as 'wildberries' | 'ozon' | 'yandex_market' | 'other') || formData.marketplace,
        });
      } else {
        setError(parsed.error || 'Не удалось распарсить ссылку');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка парсинга');
    } finally {
      setIsParsing(false);
    }
  };

  // Загрузка данных item при открытии
  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        link: item.link || '',
        price: item.price || undefined,
        image_url: item.image_url || '',
        priority: item.priority || 'medium',
        status: item.status || 'available',
        marketplace: item.marketplace || 'other',
        tags: item.tags || [],
        images: item.images || []
      });
      setError('');
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      setError('Укажите название подарка');
      return;
    }

    if (!item) {
      setError('Ошибка: подарок не выбран');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await onSubmit(item.id, formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка обновления подарка');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Редактировать подарок</h2>
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
              label="Название подарка *"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: Беспроводные наушники Sony"
              required
              fullWidth
              maxLength={200}
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
              placeholder="Дополнительная информация о подарке..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Ссылка */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ссылка на товар
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://wildberries.ru/catalog/..."
                fullWidth
                helperText="Wildberries, Ozon, Яндекс.Маркет"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleParseUrl}
                disabled={isParsing || !formData.link?.trim()}
                className="whitespace-nowrap"
              >
                {isParsing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Парсинг...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Загрузить
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Цена и ссылка на изображение */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Цена"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="5000"
                fullWidth
                helperText="В рублях"
              />
            </div>
            <div>
              <Input
                label="Ссылка на фото"
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                fullWidth
              />
            </div>
          </div>

          {/* Приоритет */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Приоритет
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, priority: 'low' })}
                className={`p-3 rounded-xl border-2 transition ${
                  formData.priority === 'low'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">😊</div>
                <div className="text-sm font-medium">Низкий</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, priority: 'medium' })}
                className={`p-3 rounded-xl border-2 transition ${
                  formData.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🙂</div>
                <div className="text-sm font-medium">Средний</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, priority: 'high' })}
                className={`p-3 rounded-xl border-2 transition ${
                  formData.priority === 'high'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🤩</div>
                <div className="text-sm font-medium">Высокий</div>
              </button>
            </div>
          </div>

          {/* Статус */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Статус
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'available' })}
                className={`p-3 rounded-xl border-2 transition ${
                  formData.status === 'available'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">Доступен</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'reserved' })}
                className={`p-3 rounded-xl border-2 transition ${
                  formData.status === 'reserved'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">Забронирован</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'purchased' })}
                className={`p-3 rounded-xl border-2 transition ${
                  formData.status === 'purchased'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">Куплен</div>
              </button>
            </div>
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
              disabled={isLoading || !formData.title?.trim()}
              fullWidth
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;

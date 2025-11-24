/**
 * Public Wishlist Page
 *
 * Публичная страница просмотра списка желаний.
 * Доступна по ссылке для гостей (без авторизации).
 * Позволяет бронировать подарки, но скрывает уже забронированные (опционально).
 */

import React, { useState } from 'react';
import {
  ItemCard,
  Button,
  Badge,
  EmptyList,
  Modal,
  Input,
  Textarea,
  Avatar,
} from '../components/ui';

const mockWishlist = {
  id: 1,
  title: 'День рождения Ивана',
  description: 'Помогите сделать мой день незабываемым! 🎉',
  eventDate: '2025-06-15',
  emoji: '🎂',
  owner: {
    name: 'Иван Петров',
    avatar: undefined,
  },
};

const mockItems = [
  {
    id: 1,
    title: 'iPhone 15 Pro 256GB',
    price: 99990,
    imageUrl: 'https://via.placeholder.com/400x400?text=iPhone',
    priority: 'high' as const,
    isReserved: false,
    link: 'https://www.apple.com',
  },
  {
    id: 2,
    title: 'AirPods Pro 2',
    price: 24990,
    imageUrl: 'https://via.placeholder.com/400x400?text=AirPods',
    priority: 'medium' as const,
    isReserved: true,
    link: 'https://www.apple.com',
  },
  {
    id: 3,
    title: 'Книга "Мастер и Маргарита"',
    price: 890,
    priority: 'low' as const,
    isReserved: false,
  },
  {
    id: 4,
    title: 'Сертификат на массаж',
    price: 3500,
    priority: 'medium' as const,
    isReserved: false,
  },
  {
    id: 5,
    title: 'Беспроводная клавиатура',
    price: 5990,
    priority: 'low' as const,
    isReserved: false,
  },
];

const PublicWishlist: React.FC = () => {
  const [items] = useState(mockItems);
  const [selectedItem, setSelectedItem] = useState<typeof mockItems[0] | null>(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Форматы
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDay = new Date(dateString);
    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntil(mockWishlist.eventDate);

  // Открыть модалку бронирования
  const handleReserve = (item: typeof mockItems[0]) => {
    setSelectedItem(item);
    setShowReserveModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎁</div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Wishlist
                </h1>
                <p className="text-xs text-gray-500">Витрина мечт</p>
              </div>
            </div>

            <Button variant="primary" size="sm">
              Создать свой список
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero секция */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 px-8 py-12 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative text-center max-w-3xl mx-auto">
              {/* Emoji */}
              <div className="text-8xl mb-6 animate-bounce">{mockWishlist.emoji}</div>

              {/* Название */}
              <h1 className="text-5xl font-bold text-white mb-4">
                {mockWishlist.title}
              </h1>

              {/* Описание */}
              <p className="text-white/90 text-xl mb-6">
                {mockWishlist.description}
              </p>

              {/* Мета информация */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="warning" size="lg">
                  📅 {formatDate(mockWishlist.eventDate)}
                </Badge>
                {daysUntil >= 0 && (
                  <Badge variant="info" size="lg">
                    ⏰ Через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Владелец */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center gap-3">
              <Avatar
                name={mockWishlist.owner.name}
                src={mockWishlist.owner.avatar}
                size="lg"
              />
              <div>
                <p className="text-sm text-gray-600">Список создан:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mockWishlist.owner.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Инструкция для гостей */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Как это работает?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">1.</span>
                  <span>Выберите подарок, который хотите подарить</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">2.</span>
                  <span>Нажмите на карточку и забронируйте его</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">3.</span>
                  <span>Владелец списка получит уведомление, но не узнает кто именинник забронировал (если вы выберете анонимно)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">4.</span>
                  <span>Другие гости не увидят забронированные подарки</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Заголовок списка подарков */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Доступные подарки ({items.filter(i => !i.isReserved).length})
          </h2>
        </div>

        {/* Сетка подарков */}
        {items.filter(i => !i.isReserved).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items
              .filter(item => !item.isReserved)
              .map((item) => (
                <ItemCard
                  key={item.id}
                  {...item}
                  onClick={() => handleReserve(item)}
                />
              ))}
          </div>
        ) : (
          <EmptyList
            title="Все подарки уже забронированы!"
            description="Попробуйте вернуться позже или создайте свой список желаний"
            action={
              <Button variant="primary">
                Создать свой список
              </Button>
            }
          />
        )}

        {/* Уже забронированные (опционально показываем количество) */}
        {items.filter(i => i.isReserved).length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-full border-2 border-green-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                {items.filter(i => i.isReserved).length} {items.filter(i => i.isReserved).length === 1 ? 'подарок уже забронирован' : 'подарка уже забронированы'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно бронирования */}
      <Modal
        isOpen={showReserveModal}
        onClose={() => {
          setShowReserveModal(false);
          setSelectedItem(null);
          setIsAnonymous(false);
        }}
        title="Забронировать подарок"
        description={selectedItem?.title}
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-indigo-900">
              🎁 Вы бронируете подарок. Владелец списка получит уведомление, но не узнает кто именно забронировал (если вы выберете анонимно).
            </p>
          </div>

          <Input
            label="Ваше имя"
            placeholder="Иван Иванов"
            required
            helperText="Это имя увидит владелец списка (если не анонимно)"
          />

          <Input
            label="Email (опционально)"
            type="email"
            placeholder="ivan@example.com"
            helperText="Для отправки подтверждения бронирования"
          />

          <Textarea
            label="Комментарий (опционально)"
            placeholder="Например: 'Я куплю этот подарок на следующей неделе'"
            rows={3}
          />

          {/* Чекбокс анонимности */}
          <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Забронировать анонимно</p>
              <p className="text-sm text-gray-600 mt-1">
                Владелец списка увидит только "Кто-то забронировал", без вашего имени
              </p>
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowReserveModal(false);
                setSelectedItem(null);
                setIsAnonymous(false);
              }}
            >
              Отмена
            </Button>
            <Button variant="primary">
              Забронировать
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublicWishlist;

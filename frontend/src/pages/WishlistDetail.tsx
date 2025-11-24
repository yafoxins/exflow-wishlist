/**
 * Wishlist Detail Page
 *
 * Страница просмотра конкретного списка желаний.
 * Отображает все подарки в списке, позволяет добавлять, редактировать, удалять.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Navbar,
  ItemCard,
  Button,
  Badge,
  EmptyList,
  CardSkeleton,
} from '../components/ui';
import { AddItemModal } from '../components/AddItemModal';
import { EditItemModal } from '../components/EditItemModal';
import { ReserveItemModal } from '../components/ReserveItemModal';
import { useAuthStore } from '../stores';
import { wishlistsService } from '../api/wishlists.service';
import { itemsService } from '../api/items.service';
import { reservationsService } from '../api/reservations.service';
import type { Wishlist, WishlistItem, ItemCreate, ItemUpdate, ReservationCreate } from '../types';

const WishlistDetail: React.FC = () => {
  const { id, username } = useParams<{ id: string; username?: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  // Загрузка wishlist и items
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // Если есть username в URL, используем публичный эндпоинт
        const wishlistData = username
          ? await wishlistsService.getByUsername(username, parseInt(id))
          : await wishlistsService.getById(parseInt(id));
        setWishlist(wishlistData);
        setItems(wishlistData.items || []);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, username, navigate, user]);

  // Создание item
  const handleCreateItem = async (data: ItemCreate) => {
    if (!id) return;

    const newItem = await itemsService.create(parseInt(id), data);
    setItems([...items, newItem]);
  };

  // Обновление item
  const handleUpdateItem = async (itemId: number, data: ItemUpdate) => {
    try {
      const updatedItem = await itemsService.update(itemId, data);
      setItems(items.map(i => i.id === itemId ? updatedItem : i));
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Ошибка при обновлении подарка');
    }
  };

  // Удаление item
  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Удалить этот подарок?')) return;

    try {
      await itemsService.delete(itemId);
      setItems(items.filter(i => i.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Ошибка при удалении подарка');
    }
  };

  // Клик на item
  const handleItemClick = (item: WishlistItem) => {
    const itemIsOwner = user?.id === wishlist?.owner_id;

    // Если это владелец или подарок уже забронирован - ничего не делаем
    if (itemIsOwner || item.status !== 'available') {
      return;
    }

    // Если гость и подарок доступен - открываем модальное окно бронирования
    setSelectedItem(item);
    setIsReserveModalOpen(true);
  };

  // Бронирование item
  const handleReserveItem = async (data: ReservationCreate) => {
    await reservationsService.create(data);

    // Обновляем статус item в локальном состоянии
    setItems(items.map(item =>
      item.id === data.item_id
        ? { ...item, status: 'reserved' as const }
        : item
    ));
  };

  // Статистика
  const totalItems = items.length;
  const reservedItems = items.filter(i => i.status === 'reserved' || i.status === 'purchased').length;
  const totalPrice = items.reduce((sum, i) => sum + (i.price || 0), 0);

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Дни до события
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDay = new Date(dateString);
    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = wishlist?.event_date ? getDaysUntil(wishlist.event_date) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Navbar
          user={{
            name: user?.full_name || 'Пользователь',
            email: user?.email || '',
            avatar: user?.avatar_url
          }}
          onProfileClick={() => navigate('/profile')}
          onLogout={() => {
            logout();
            navigate('/login');
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return null;
  }

  const isOwner = user?.id === wishlist.owner_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar
        user={{
          name: user?.full_name || 'Пользователь',
          email: user?.email || '',
          avatar: user?.avatar_url
        }}
        menuItems={[
          {
            label: 'Мои списки',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ),
            onClick: () => navigate('/dashboard'),
            active: false,
          },
        ]}
        onProfileClick={() => navigate('/profile')}
        onLogout={() => {
          logout();
          navigate('/login');
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header с информацией о списке */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 px-8 py-12 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  {/* Emoji */}
                  <div className="text-7xl mb-4">{wishlist.emoji || '🎁'}</div>

                  {/* Название */}
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {wishlist.title}
                  </h1>

                  {/* Описание */}
                  {wishlist.description && (
                    <p className="text-white/90 text-lg mb-4">
                      {wishlist.description}
                    </p>
                  )}

                  {/* Мета информация */}
                  <div className="flex flex-wrap items-center gap-3">
                    {wishlist.event_date && (
                      <>
                        <Badge variant="warning" size="lg">
                          📅 {formatDate(wishlist.event_date)}
                        </Badge>
                        {daysUntil !== null && daysUntil >= 0 && (
                          <Badge variant="info" size="lg">
                            ⏰ Через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
                          </Badge>
                        )}
                      </>
                    )}
                    {wishlist.access_type === 'public' && (
                      <Badge variant="success" size="lg">
                        🌐 Публичный
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Действия */}
                {isOwner && (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      }
                      onClick={() => {
                        const url = `${window.location.origin}/wishlist/${wishlist.id}`;
                        navigator.clipboard.writeText(url);
                        alert('Ссылка скопирована!');
                      }}
                    >
                      Поделиться
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="px-6 py-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Всего подарков</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Забронировано</p>
              <p className="text-2xl font-bold text-green-600">{reservedItems}</p>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Осталось</p>
              <p className="text-2xl font-bold text-indigo-600">{totalItems - reservedItems}</p>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Общая стоимость</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</p>
            </div>
          </div>
        </div>

        {/* Кнопка добавления */}
        {isOwner && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Подарки ({items.length})
            </h2>
            <Button
              variant="primary"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
              onClick={() => setIsAddItemModalOpen(true)}
            >
              Добавить подарок
            </Button>
          </div>
        )}

        {/* Сетка подарков */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <ItemCard
                  title={item.title}
                  price={item.price}
                  imageUrl={item.image_url}
                  priority={item.priority}
                  status={item.status}
                  link={item.link}
                  onClick={() => handleItemClick(item)}
                />
                {isOwner && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setIsEditItemModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                      title="Редактировать подарок"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                      title="Удалить подарок"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyList
            title="Пока нет подарков"
            description={isOwner ? "Добавьте первый подарок в список" : "Владелец еще не добавил подарки"}
            action={
              isOwner ? (
                <Button onClick={() => setIsAddItemModalOpen(true)}>
                  Добавить подарок
                </Button>
              ) : undefined
            }
          />
        )}
      </div>

      {/* Модальное окно добавления подарка */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      {/* Модальное окно редактирования подарка */}
      <EditItemModal
        isOpen={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleUpdateItem}
        item={selectedItem}
      />

      {/* Модальное окно бронирования подарка */}
      <ReserveItemModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        onSubmit={handleReserveItem}
        item={selectedItem}
      />
    </div>
  );
};

export default WishlistDetail;

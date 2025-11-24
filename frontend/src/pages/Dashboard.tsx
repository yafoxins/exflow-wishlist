/**
 * Dashboard Page
 *
 * Главная страница приложения после входа.
 * Отображает все списки желаний пользователя в виде сетки карточек.
 * Поддерживает создание нового списка, поиск и фильтрацию.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navbar,
  WishlistCard,
  Button,
  Input,
  EmptyList,
  CardSkeleton,
  Select,
} from '../components/ui';
import { useAuthStore } from '../stores';
import { wishlistsService } from '../api/wishlists.service';
import type { Wishlist, WishlistCreate } from '../types';
import CreateWishlistModal from '../components/CreateWishlistModal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Загрузка списков при монтировании
  useEffect(() => {
    const loadWishlists = async () => {
      try {
        setIsLoading(true);
        const data = await wishlistsService.getAll();
        setWishlists(data);
      } catch (error) {
        console.error('Error loading wishlists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlists();
  }, []);

  // Создание нового списка
  const handleCreateWishlist = async (data: WishlistCreate) => {
    const newWishlist = await wishlistsService.create(data);
    setWishlists([newWishlist, ...wishlists]);
  };

  // Удаление списка
  const handleDeleteWishlist = async (id: number, title: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить список "${title}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await wishlistsService.delete(id);
      setWishlists(wishlists.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting wishlist:', error);
      alert('Ошибка при удалении списка');
    }
  };

  // Фильтрация по поисковому запросу
  const filteredWishlists = wishlists.filter((wishlist) =>
    wishlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wishlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Сортировка
  const sortedWishlists = [...filteredWishlists].sort((a, b) => {
    if (sortBy === 'date' && a.event_date && b.event_date) {
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    }
    if (sortBy === 'items') {
      const aItems = a.items?.length || 0;
      const bItems = b.items?.length || 0;
      return bItems - aItems;
    }
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

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
            active: true,
          },
        ]}
        onProfileClick={() => navigate('/profile')}
        onLogout={() => {
          logout();
          navigate('/login');
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Мои списки желаний
            </h1>
            <p className="text-gray-600">
              У вас {wishlists.length} {wishlists.length === 1 ? 'список' : wishlists.length < 5 ? 'списка' : 'списков'}
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
            onClick={() => setShowCreateModal(true)}
          >
            Создать список
          </Button>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              fullWidth
            />
          </div>

          <Select
            options={[
              { value: 'date', label: 'По дате события', icon: '📅' },
              { value: 'items', label: 'По кол-ву подарков', icon: '🎁' },
              { value: 'name', label: 'По названию', icon: '🔤' },
            ]}
            value={sortBy}
            onChange={setSortBy}
            fullWidth={false}
            className="sm:w-64"
          />
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📋</div>
              <div>
                <p className="text-sm text-gray-600">Всего списков</p>
                <p className="text-2xl font-bold text-gray-900">{wishlists.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎁</div>
              <div>
                <p className="text-sm text-gray-600">Всего подарков</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wishlists.reduce((sum, w) => sum + (w.items?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🌐</div>
              <div>
                <p className="text-sm text-gray-600">Публичных</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wishlists.filter(w => w.access_type === 'public').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Сетка списков */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : sortedWishlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWishlists.map((wishlist) => (
              <WishlistCard
                key={wishlist.id}
                title={wishlist.title}
                description={wishlist.description}
                itemCount={wishlist.items?.length || 0}
                eventDate={wishlist.event_date}
                emoji={wishlist.emoji || '🎁'}
                isPublic={wishlist.access_type === 'public'}
                onClick={() => {
                  if (user?.username) {
                    navigate(`/${user.username}/${wishlist.id}`);
                  } else {
                    navigate(`/wishlist/${wishlist.id}`);
                  }
                }}
                onDelete={() => handleDeleteWishlist(wishlist.id, wishlist.title)}
              />
            ))}
          </div>
        ) : (
          <EmptyList
            title={searchQuery ? 'Ничего не найдено' : 'У вас пока нет списков'}
            description={
              searchQuery
                ? 'Попробуйте изменить поисковый запрос'
                : 'Создайте свой первый список желаний и начните собирать подарки мечты'
            }
            action={
              !searchQuery && (
                <Button onClick={() => setShowCreateModal(true)}>
                  Создать первый список
                </Button>
              )
            }
          />
        )}
      </div>

      {/* Create Wishlist Modal */}
      <CreateWishlistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWishlist}
      />
    </div>
  );
};

export default Dashboard;

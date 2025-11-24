/**
 * Profile Page
 *
 * Страница профиля пользователя.
 * Настройки аккаунта, управление подключенными сервисами,
 * уведомления, безопасность.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navbar,
  Input,
  Button,
  Badge,
  Avatar,
  Modal,
} from '../components/ui';
import { useAuthStore } from '../stores';
import { usersService } from '../api/users.service';
import type { UserUpdate } from '../api/users.service';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<UserUpdate>({
    full_name: user?.full_name || '',
    username: user?.username || '',
    avatar_url: user?.avatar_url || '',
  });

  // Форматирование даты регистрации
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const handleSave = async () => {
    if (!formData.full_name?.trim()) {
      setError('Укажите имя');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const updatedUser = await usersService.updateMe(formData);
      setUser(updatedUser);
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка обновления профиля');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      username: user?.username || '',
      avatar_url: user?.avatar_url || '',
    });
    setIsEditing(false);
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'УДАЛИТЬ') {
      setError('Введите "УДАЛИТЬ" для подтверждения');
      return;
    }

    try {
      setIsDeleting(true);
      setError('');

      await usersService.deleteMe();

      // Выходим и редиректим на главную
      logout();
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка удаления аккаунта');
    } finally {
      setIsDeleting(false);
    }
  };

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
          {
            label: 'Профиль',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ),
            onClick: () => {},
            active: true,
          },
        ]}
        onProfileClick={() => {}}
        onLogout={handleLogout}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Профиль</h1>
          <p className="text-gray-600">Управление вашим аккаунтом и настройками</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Карточка профиля */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Header с градиентом */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-8 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Аватар */}
              <Avatar
                src={user?.avatar_url}
                name={user?.full_name || 'U'}
                size="2xl"
              />

              {/* Информация */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{user?.full_name || 'Пользователь'}</h2>
                <p className="text-white/90 mb-3">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  {user?.is_verified && (
                    <Badge variant="success">
                      ✓ Email подтверждён
                    </Badge>
                  )}
                  {user?.created_at && (
                    <Badge variant="info">
                      С нами с {formatDate(user.created_at)}
                    </Badge>
                  )}
                  {user?.telegram_username && (
                    <Badge variant="info">
                      📱 @{user.telegram_username}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Кнопка редактирования */}
              {!isEditing && (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать
                </Button>
              )}
            </div>
          </div>

          {/* Форма редактирования */}
          {isEditing && (
            <div className="px-8 py-6 border-t border-gray-200 space-y-4">
              <Input
                label="Полное имя *"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                fullWidth
              />
              <Input
                label="Username (опционально)"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                helperText="Используется для публичного профиля"
                fullWidth
              />
              <Input
                label="URL аватара (опционально)"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                helperText="Ссылка на изображение профиля"
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
                helperText="Email нельзя изменить"
                fullWidth
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Отмена
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving || !formData.full_name?.trim()}
                >
                  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Подключенные сервисы */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Подключенные сервисы
          </h3>

          <div className="space-y-4">
            {/* Telegram */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                  📱
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Telegram</p>
                  {user?.telegram_username ? (
                    <p className="text-sm text-gray-600">@{user.telegram_username}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Не подключен</p>
                  )}
                </div>
              </div>

              {user?.telegram_username ? (
                <Badge variant="success">Подключено</Badge>
              ) : (
                <Button variant="primary" size="sm">
                  Подключить
                </Button>
              )}
            </div>

            {/* Yandex ID */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-2xl">
                  🔴
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Яндекс ID</p>
                  <p className="text-sm text-gray-500">
                    {user?.email?.includes('yandex') ? 'Подключено' : 'Доступно для подключения'}
                  </p>
                </div>
              </div>

              <Badge variant="info">OAuth</Badge>
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Настройки уведомлений
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Бронирование подарка</p>
                <p className="text-sm text-gray-600">Уведомлять когда кто-то бронирует подарок из моего списка</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Напоминания о событиях</p>
                <p className="text-sm text-gray-600">Получать напоминания за 7, 3 и 1 день до события</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Новости и обновления</p>
                <p className="text-sm text-gray-600">Получать информацию о новых функциях</p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Опасная зона */}
        <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
          <h3 className="text-xl font-bold text-red-900 mb-2">
            Опасная зона
          </h3>
          <p className="text-red-700 mb-4">
            Эти действия необратимы. Будьте осторожны!
          </p>

          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Удалить аккаунт
          </Button>
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить аккаунт?"
        description="Это действие нельзя отменить"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-red-900">
              ⚠️ <strong>Внимание!</strong> Будут удалены:
            </p>
            <ul className="mt-2 ml-6 text-sm text-red-800 list-disc space-y-1">
              <li>Все ваши списки желаний</li>
              <li>Все подарки</li>
              <li>Информация о бронированиях</li>
              <li>Ваш профиль и настройки</li>
            </ul>
          </div>

          <Input
            label='Введите "УДАЛИТЬ" для подтверждения'
            placeholder="УДАЛИТЬ"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            fullWidth
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation('');
                setError('');
              }}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmation !== 'УДАЛИТЬ'}
            >
              {isDeleting ? 'Удаление...' : 'Да, удалить аккаунт'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

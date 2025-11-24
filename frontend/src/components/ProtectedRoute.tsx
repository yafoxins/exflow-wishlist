/**
 * Protected Route Component
 *
 * Компонент для защиты приватных маршрутов.
 * Перенаправляет неавторизованных пользователей на страницу входа.
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { PageLoader } from '../components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Пробуем загрузить пользователя если есть токен
    const token = localStorage.getItem('access_token');
    if (token && !isAuthenticated && !isLoading) {
      fetchUser();
    }
  }, [isAuthenticated, isLoading, fetchUser]);

  // Показываем загрузку пока проверяем токен
  if (isLoading) {
    return <PageLoader message="Проверяем авторизацию..." />;
  }

  // Если не авторизован - редирект на login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

/**
 * Main App Component
 *
 * Корневой компонент приложения с роутером
 */

import React, { useEffect } from 'react';
import AppRouter from './Router';
import { useAuthStore } from './stores';

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  // При загрузке приложения проверяем авторизацию
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !isAuthenticated) {
      fetchUser();
    }
  }, []);

  return <AppRouter />;
}

export default App;

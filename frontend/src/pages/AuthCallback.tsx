/**
 * OAuth Callback Page
 *
 * Обрабатывает редирект после OAuth авторизации (Яндекс, Telegram)
 * Получает токены из URL параметров и авторизует пользователя
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens } = useAuthStore();
  const [error, setError] = useState('');

  useEffect(() => {
    const processAuth = () => {
      console.log('[AuthCallback] Starting auth process...');

      // Получаем токены из URL
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      console.log('[AuthCallback] Tokens received:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });

      if (!accessToken || !refreshToken) {
        console.error('[AuthCallback] Missing tokens');
        setError('Отсутствуют токены авторизации');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Сохраняем токены
      setTokens(accessToken, refreshToken);
      console.log('[AuthCallback] Tokens saved, redirecting to dashboard...');

      // Редиректим на dashboard
      // Даем время на обновление store и переход на dashboard
      // ProtectedRoute увидит isAuthenticated: true и пропустит
      setTimeout(() => {
        console.log('[AuthCallback] Executing redirect now');
        navigate('/dashboard', { replace: true });
      }, 1000);
    };

    processAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Запускаем только один раз при монтировании

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {error ? (
          <>
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка авторизации</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Перенаправление на страницу входа...</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Авторизация...</h2>
            <p className="text-gray-600">Пожалуйста, подождите</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

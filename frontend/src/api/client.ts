/**
 * API Client
 *
 * Axios instance с interceptors для работы с backend API.
 * Автоматически добавляет токены, обрабатывает ошибки, логирует запросы.
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Базовый URL API (из переменных окружения или дефолтный)
// Используем относительный путь, так как nginx проксирует /api/* на backend
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

// Создаем axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Добавляет JWT токен к каждому запросу
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Логируем запрос в dev режиме
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Обрабатывает ошибки, обновляет токены
 */
apiClient.interceptors.response.use(
  (response) => {
    // Логируем успешный ответ в dev режиме
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response from ${response.config.url}:`, response.status, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    console.error('[API] Response error:', error.message, error.response?.status, error.config?.url);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Если 401 и это не повторный запрос - пробуем обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          // Пытаемся обновить токен
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Повторяем оригинальный запрос с новым токеном
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Если обновление токена не удалось - разлогиниваем
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Логируем ошибку
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Типы для API responses
 */
export interface ApiError {
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Helper для обработки API ошибок
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.detail || apiError?.message || 'Произошла ошибка';
  }
  return 'Произошла неизвестная ошибка';
};

export default apiClient;

/**
 * Landing Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores';

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-indigo-600">ExFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Перейти к спискам
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Начать бесплатно
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Создавайте и делитесь
            <br />
            <span className="text-indigo-600">списками желаний</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Удобный сервис для создания списков подарков и желаний.
            Делитесь с друзьями и получайте именно то, что хотите!
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-lg shadow-lg"
              >
                Начать бесплатно
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition font-semibold text-lg border-2 border-indigo-600"
              >
                Войти
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Создавайте списки</h3>
            <p className="text-gray-600 leading-relaxed">
              Для дня рождения, Нового года, свадьбы или просто список мечты.
              Все ваши желания в одном месте!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Делитесь ссылкой</h3>
            <p className="text-gray-600 leading-relaxed">
              Отправьте ссылку друзьям в Telegram, WhatsApp или любом мессенджере.
              Они смогут сразу увидеть что вам нужно!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Получайте подарки</h3>
            <p className="text-gray-600 leading-relaxed">
              Друзья увидят что вам нужно и забронируют подарок.
              Никаких дубликатов и ненужных вещей!
            </p>
          </div>
        </div>
      </section>

      {/* Telegram Integration */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Интеграция с Telegram</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Открывайте списки прямо в Telegram через WebApp и получайте
              уведомления о бронировании подарков
            </p>
            <a
              href="https://t.me/exflowlistbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition shadow-lg"
            >
              <span className="text-2xl mr-2">▶️</span>
              Открыть бота @exflowlistbot
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-6 text-gray-600">
            <Link to="/terms" className="hover:text-indigo-600 transition">
              Условия использования
            </Link>
            <Link to="/privacy" className="hover:text-indigo-600 transition">
              Политика конфиденциальности
            </Link>
          </div>
          <p className="text-gray-500">
            © 2024 ExFlow. Сделано с ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

/**
 * Terms of Service Page
 *
 * Пользовательское соглашение
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }>
            Назад
          </Button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Пользовательское соглашение
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Общие положения</h2>
              <p>
                Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между
                владельцем сервиса Wishlist (далее — Сервис) и пользователем данного Сервиса.
              </p>
              <p>
                Использование Сервиса означает безоговорочное согласие пользователя с настоящим Соглашением
                и указанными в нем условиями.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Предмет соглашения</h2>
              <p>
                Администрация Сервиса предоставляет пользователю право на использование Сервиса для:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Создания и управления списками желаний</li>
                <li>Обмена списками с другими пользователями</li>
                <li>Бронирования подарков из списков других пользователей</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Права и обязанности сторон</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Пользователь обязуется:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Предоставлять достоверную информацию при регистрации</li>
                <li>Не использовать Сервис в противоправных целях</li>
                <li>Не нарушать права других пользователей</li>
                <li>Соблюдать конфиденциальность данных других пользователей</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Администрация обязуется:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Обеспечивать работоспособность Сервиса</li>
                <li>Защищать персональные данные пользователей</li>
                <li>Своевременно информировать об изменениях в Сервисе</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ответственность сторон</h2>
              <p>
                Администрация не несет ответственности за:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Временные сбои и перерывы в работе Сервиса</li>
                <li>Действия или бездействие третьих лиц</li>
                <li>Потерю данных пользователя по независящим от Администрации причинам</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Заключительные положения</h2>
              <p>
                Настоящее Соглашение вступает в силу с момента начала использования Сервиса и действует
                до момента прекращения использования Сервиса пользователем.
              </p>
              <p>
                Администрация оставляет за собой право в любое время изменять или дополнять настоящее
                Соглашение. Изменения вступают в силу с момента их публикации.
              </p>
            </section>

            <div className="mt-12 p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200">
              <p className="text-sm text-gray-700">
                <strong>Последнее обновление:</strong> {new Date().toLocaleDateString('ru-RU')}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                По всем вопросам обращайтесь: support@wishlist.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

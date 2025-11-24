/**
 * 404 Not Found Page
 *
 * Страница для несуществующих маршрутов
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/ui';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <EmptyState
        emoji="🔍"
        title="404 - Страница не найдена"
        description="К сожалению, страница которую вы ищете не существует. Возможно она была удалена или перемещена."
        size="lg"
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Назад
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              На главную
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFound;

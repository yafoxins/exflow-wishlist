/**
 * Onboarding Page
 *
 * Страница приветствия и обучения для новых пользователей
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

const steps = [
  {
    emoji: '🎁',
    title: 'Добро пожаловать в Wishlist!',
    description: 'Создавайте списки желаний и делитесь ими с друзьями. Больше никаких повторяющихся подарков!',
  },
  {
    emoji: '📋',
    title: 'Создавайте списки',
    description: 'Добавляйте списки для разных событий: день рождения, свадьба, Новый год или просто список мечт.',
  },
  {
    emoji: '🔗',
    title: 'Делитесь ссылками',
    description: 'Отправьте ссылку друзьям, и они смогут забронировать подарки. Вы не увидите кто что выбрал!',
  },
  {
    emoji: '🎉',
    title: 'Получайте подарки мечты',
    description: 'В день события получите именно то, что хотели. Без сюрпризов и разочарований!',
  },
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Последний шаг - перейти на дашборд
      localStorage.setItem('onboarding_completed', 'true');
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Skip button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Пропустить
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-500'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          {/* Emoji */}
          <div className="text-9xl mb-8 animate-bounce">{step.emoji}</div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {step.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            {step.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Назад
              </Button>
            )}
            <Button variant="primary" size="lg" onClick={handleNext}>
              {currentStep < steps.length - 1 ? 'Далее' : 'Начать'}
            </Button>
          </div>
        </div>

        {/* Step counter */}
        <div className="text-center mt-8 text-gray-600">
          Шаг {currentStep + 1} из {steps.length}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

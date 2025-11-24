/**
 * Select Component
 *
 * Кастомный выпадающий список с поддержкой поиска, групп, иконок.
 * Красивая альтернатива нативному <select>.
 *
 * @example
 * <Select
 *   label="Приоритет"
 *   options={[
 *     { value: 'low', label: 'Низкий', icon: '⬇️' },
 *     { value: 'medium', label: 'Средний', icon: '➡️' },
 *     { value: 'high', label: 'Высокий', icon: '⬆️' },
 *   ]}
 *   value={priority}
 *   onChange={setPriority}
 * />
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  /** Значение опции */
  value: string;
  /** Отображаемый текст */
  label: string;
  /** Иконка (emoji или React-элемент) */
  icon?: React.ReactNode;
  /** Опция недоступна */
  disabled?: boolean;
}

interface SelectProps {
  /** Метка поля */
  label?: string;
  /** Список опций */
  options: SelectOption[];
  /** Текущее значение */
  value?: string;
  /** Обработчик изменения */
  onChange: (value: string) => void;
  /** Плейсхолдер */
  placeholder?: string;
  /** Текст ошибки */
  error?: string;
  /** Полная ширина */
  fullWidth?: boolean;
  /** Поиск по опциям */
  searchable?: boolean;
  /** Disabled состояние */
  disabled?: boolean;
  /** CSS классы */
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Выберите значение',
  error,
  fullWidth = true,
  searchable = false,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Находим выбранную опцию
  const selectedOption = options.find(opt => opt.value === value);

  // Фильтруем опции по поисковому запросу
  const filteredOptions = searchable && searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Закрываем при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Обработка выбора опции
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative', fullWidth && 'w-full', className)}
    >
      {/* Метка */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Триггер */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-2',
          'px-4 py-2.5 rounded-xl border-2 transition-all duration-200',
          'text-left focus:outline-none focus:ring-2 focus:ring-offset-1',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-gray-300',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
          !disabled && 'cursor-pointer'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOption?.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className={cn(
            'truncate',
            selectedOption ? 'text-gray-900' : 'text-gray-400'
          )}>
            {selectedOption?.label || placeholder}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-64 overflow-auto animate-in slide-in-from-top-2 duration-200">
          {/* Поле поиска */}
          {searchable && (
            <div className="px-2 pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
          )}

          {/* Список опций */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors',
                  option.value === value
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span className="flex-1">{option.label}</span>

                {/* Галочка для выбранной опции */}
                {option.value === value && (
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              Ничего не найдено
            </div>
          )}
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;

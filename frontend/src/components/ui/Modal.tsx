/**
 * Modal Component
 *
 * Модальное окно с поддержкой различных размеров, заголовка, футера.
 * Включает backdrop, анимации открытия/закрытия, закрытие по ESC и клику вне.
 *
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Добавить подарок"
 *   footer={
 *     <>
 *       <Button variant="outline" onClick={handleClose}>Отмена</Button>
 *       <Button onClick={handleSave}>Сохранить</Button>
 *     </>
 *   }
 * >
 *   <ItemForm />
 * </Modal>
 */

import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean;
  /** Обработчик закрытия */
  onClose: () => void;
  /** Заголовок */
  title?: string;
  /** Описание под заголовком */
  description?: string;
  /** Размер модального окна */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Содержимое футера */
  footer?: React.ReactNode;
  /** Дочерние элементы */
  children: React.ReactNode;
  /** Отключить закрытие по клику вне модалки */
  disableBackdropClose?: boolean;
  /** CSS классы для контейнера */
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
  disableBackdropClose = false,
  className,
}) => {
  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Размеры модалки
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !disableBackdropClose && onClose()}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl w-full animate-in zoom-in-95 duration-200',
          'flex flex-col max-h-[90vh]',
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex-1 space-y-1">
              {title && (
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>

            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Закрыть"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

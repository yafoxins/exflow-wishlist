/**
 * UI Components Library
 *
 * Централизованный экспорт всех UI компонентов.
 * Используйте импорты из этого файла для удобства:
 *
 * import { Button, Input, Card, Modal } from '@/components/ui';
 */

// Базовые компоненты
export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Input, Textarea } from './Input';
export type { InputProps, TextareaProps } from './Input';

export { default as Select } from './Select';
export type { SelectOption } from './Select';

export { default as Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { default as Avatar, AvatarGroup } from './Avatar';

// Карточки
export { default as Card, WishlistCard, ItemCard } from './Card';

// Модальные окна
export { default as Modal } from './Modal';
export type { ModalProps } from './Modal';

// Навигация
export { default as Navbar } from './Navbar';

// Состояния загрузки
export {
  default as Spinner,
  PageLoader,
  Skeleton,
  CardSkeleton,
} from './Loading';

// Пустые состояния
export {
  default as EmptyState,
  EmptyList,
  EmptySearch,
  ErrorState,
  OfflineState,
} from './EmptyState';

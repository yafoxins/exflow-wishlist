/**
 * Утилита для объединения classNames с поддержкой условий
 * Альтернатива библиотеке clsx/classnames
 */

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

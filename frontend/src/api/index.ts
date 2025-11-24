/**
 * API Services Export
 *
 * Централизованный экспорт всех API сервисов
 */

export { default as apiClient, getErrorMessage } from './client';
export { authService } from './auth.service';
export { wishlistsService } from './wishlists.service';
export { itemsService } from './items.service';
export { reservationsService } from './reservations.service';
export { parserService } from './parser.service';

/**
 * Parser API Service
 *
 * Методы для парсинга товаров с маркетплейсов
 */

import apiClient from './client';
import type { ParseProductRequest, ParsedProduct } from '../types';

export const parserService = {
  /**
   * Распарсить товар по URL
   */
  parseProduct: async (url: string): Promise<ParsedProduct> => {
    const response = await apiClient.post<ParsedProduct>('/parser/parse-url', { url });
    return response.data;
  },
};

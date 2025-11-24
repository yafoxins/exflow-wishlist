/**
 * TypeScript Types
 *
 * Типы для всех сущностей приложения
 */

// User
export interface User {
  id: number;
  email: string;
  full_name: string;
  username?: string;
  telegram_id?: number;
  telegram_username?: string;
  is_verified: boolean;
  avatar_url?: string;
  birth_date?: string;
  created_at: string;
  last_login?: string;
}

// OAuth Account
export interface OAuthAccount {
  id: number;
  provider: 'yandex' | 'telegram';
  provider_user_id: string;
  access_token?: string;
}

// Wishlist
export interface Wishlist {
  id: number;
  title: string;
  description?: string;
  emoji?: string;
  event_date?: string;
  access_type: 'private' | 'by_link' | 'public';
  allow_reservations: boolean;
  owner_id: number;
  owner?: User;
  items?: WishlistItem[];
  created_at: string;
  updated_at: string;
}

export type WishlistCreate = Omit<Wishlist, 'id' | 'owner_id' | 'owner' | 'items' | 'created_at' | 'updated_at'>;
export type WishlistUpdate = Partial<WishlistCreate>;

// Wishlist Item
export interface WishlistItem {
  id: number;
  wishlist_id: number;
  title: string;
  description?: string;
  price?: number;
  link?: string;
  image_url?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'available' | 'reserved' | 'purchased';
  marketplace?: 'wildberries' | 'ozon' | 'yandex_market' | 'other';
  images?: string[];
  tags?: string[];
  position?: number;
  reservation?: Reservation;
  created_at: string;
  updated_at: string;
}

export type ItemCreate = Omit<WishlistItem, 'id' | 'wishlist_id' | 'reservation' | 'created_at' | 'updated_at'>;
export type ItemUpdate = Partial<ItemCreate>;

// Reservation
export interface Reservation {
  id: number;
  item_id: number;
  user_id?: number;
  guest_name?: string;
  guest_email?: string;
  comment?: string;
  is_anonymous: boolean;
  created_at: string;
}

export type ReservationCreate = {
  item_id: number;
  guest_name?: string;
  guest_email?: string;
  comment?: string;
  is_anonymous: boolean;
};

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

// Parser
export interface ParseProductRequest {
  url: string;
}

export interface ParsedProduct {
  title?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string;
  image_url?: string | null;
  images?: string[];
  marketplace?: string;
  success: boolean;
  error?: string | null;
}

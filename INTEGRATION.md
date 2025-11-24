# 🔗 Frontend Integration Guide

Полная документация по интеграции frontend с backend и архитектуре приложения.

---

## 📦 Архитектура

```
frontend/src/
├── api/                  # API клиент и сервисы
│   ├── client.ts        # Axios instance с interceptors
│   ├── auth.service.ts   # Аутентификация
│   ├── wishlists.service.ts
│   ├── items.service.ts
│   ├── reservations.service.ts
│   └── parser.service.ts
│
├── stores/              # Zustand state management
│   ├── authStore.ts     # Auth state
│   ├── wishlistsStore.ts
│   └── itemsStore.ts
│
├── schemas/             # Zod validation schemas
│   ├── auth.schema.ts
│   ├── wishlist.schema.ts
│   ├── item.schema.ts
│   └── reservation.schema.ts
│
├── hooks/               # Custom React hooks
│   ├── useForm.ts       # React Hook Form + Zod
│   ├── useDebounce.ts
│   └── useToast.ts
│
├── components/          # React компоненты
│   ├── ui/             # UI библиотека (20+ компонентов)
│   └── ProtectedRoute.tsx
│
├── pages/              # Страницы приложения
│   ├── Dashboard.tsx
│   ├── WishlistDetail.tsx
│   ├── PublicWishlist.tsx
│   ├── Profile.tsx
│   ├── Onboarding.tsx
│   ├── NotFound.tsx
│   ├── Terms.tsx
│   └── Privacy.tsx
│
├── types/              # TypeScript types
│   └── index.ts        # User, Wishlist, Item, Reservation
│
├── Router.tsx          # React Router конфигурация
└── App.tsx             # Root component
```

---

## 🚀 Quick Start

### 1. Установка зависимостей

```bash
cd frontend
npm install --legacy-peer-deps
```

### 2. Настройка окружения

Создайте `.env` файл:

```bash
cp .env.example .env
```

Отредактируйте переменные:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### 3. Запуск

```bash
npm start
```

Приложение откроется на `http://localhost:3000`

---

## 🔐 Аутентификация

### Flow

1. Пользователь вводит credentials
2. `authStore.login()` вызывает `authService.login()`
3. API возвращает `access_token` и `refresh_token`
4. Токены сохраняются в `localStorage`
5. `apiClient` автоматически добавляет токен к запросам
6. При 401 ошибке - автоматический refresh

### Использование

```tsx
import { useAuthStore } from './stores';

function LoginPage() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (data) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      // Ошибка уже в store.error
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      {/* ... */}
    </form>
  );
}
```

---

## 📋 Работа со списками

### Загрузка списков

```tsx
import { useWishlistsStore } from './stores';

function Dashboard() {
  const { wishlists, isLoading, fetchWishlists } = useWishlistsStore();

  useEffect(() => {
    fetchWishlists();
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <div>
      {wishlists.map(wishlist => (
        <WishlistCard key={wishlist.id} {...wishlist} />
      ))}
    </div>
  );
}
```

### Создание списка

```tsx
import { useWishlistsStore } from './stores';
import { useForm } from './hooks';
import { wishlistSchema } from './schemas';

function CreateWishlistForm() {
  const { createWishlist } = useWishlistsStore();
  const { register, handleSubmit, formState: { errors } } = useForm(wishlistSchema);

  const onSubmit = async (data) => {
    const newWishlist = await createWishlist(data);
    navigate(`/wishlist/${newWishlist.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('title')}
        label="Название"
        error={errors.title?.message}
      />
      {/* ... */}
    </form>
  );
}
```

---

## 🎁 Работа с подарками

### Добавление подарка

```tsx
import { useItemsStore } from './stores';
import { useForm } from './hooks';
import { itemSchema } from './schemas';

function AddItemForm({ wishlistId }) {
  const { createItem } = useItemsStore();
  const { register, handleSubmit, formState: { errors } } = useForm(itemSchema);

  const onSubmit = async (data) => {
    await createItem(wishlistId, data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title')} error={errors.title?.message} />
      <Input {...register('price')} type="number" />
      <Select
        options={[
          { value: 'low', label: 'Низкий' },
          { value: 'medium', label: 'Средний' },
          { value: 'high', label: 'Высокий' },
        ]}
        {...register('priority')}
      />
    </form>
  );
}
```

---

## 🎯 Валидация форм

### Схемы Zod

Все схемы находятся в `/schemas`:

```tsx
import { z } from 'zod';

export const wishlistSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  event_date: z.string().optional(),
  access_type: z.enum(['private', 'by_link', 'public']),
  allow_reservations: z.boolean().default(true),
});
```

### Использование с формами

```tsx
import { useForm } from './hooks';
import { wishlistSchema } from './schemas';

const { register, handleSubmit, formState: { errors } } = useForm(wishlistSchema);
```

Валидация происходит автоматически при submit и onChange!

---

## 🔄 State Management (Zustand)

### Auth Store

```tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}
```

### Wishlists Store

```tsx
interface WishlistsState {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;

  fetchWishlists: () => Promise<void>;
  fetchWishlist: (id: number) => Promise<void>;
  createWishlist: (data: WishlistCreate) => Promise<Wishlist>;
  updateWishlist: (id: number, data: WishlistUpdate) => Promise<void>;
  deleteWishlist: (id: number) => Promise<void>;
}
```

---

## 🛡️ Защищенные маршруты

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

`ProtectedRoute` проверяет:
1. Наличие токена в localStorage
2. Валидность токена (вызывает `/auth/me`)
3. Редиректит на `/login` если не авторизован

---

## 🎨 UI Components

### Использование

```tsx
import { Button, Input, Modal, WishlistCard } from './components/ui';

<Button variant="primary" onClick={handleClick}>
  Создать
</Button>

<Input
  label="Email"
  error={errors.email?.message}
  leftIcon={<EmailIcon />}
/>

<WishlistCard
  title="День рождения"
  itemCount={12}
  eventDate="2025-06-15"
  onClick={() => navigate(`/wishlist/${id}`)}
/>
```

Все компоненты документированы в `COMPONENTS.md`

---

## 🔧 Custom Hooks

### useForm

```tsx
const { register, handleSubmit, formState } = useForm(schema);
```

### useDebounce

```tsx
const debouncedSearch = useDebounce(searchQuery, 500);
```

### useToast

```tsx
const { success, error, info } = useToast();

success('Список создан!');
error('Ошибка сохранения');
```

---

## 📡 API Client

### Auto-configured

- Базовый URL: из `.env`
- Auto JWT токен в headers
- Auto refresh при 401
- Request/Response logging в dev
- Error handling

### Использование напрямую

```tsx
import { apiClient } from './api';

const response = await apiClient.get('/wishlists');
const wishlist = await apiClient.post('/wishlists', data);
```

---

## 🎯 Best Practices

### 1. Всегда используйте stores

❌ **Плохо:**
```tsx
const [wishlists, setWishlists] = useState([]);
useEffect(() => {
  fetch('/api/wishlists').then(setWishlists);
}, []);
```

✅ **Хорошо:**
```tsx
const { wishlists, fetchWishlists } = useWishlistsStore();
useEffect(() => {
  fetchWishlists();
}, []);
```

### 2. Валидация через Zod schemas

❌ **Плохо:**
```tsx
if (title.length < 3) {
  setError('Too short');
}
```

✅ **Хорошо:**
```tsx
const { register, formState: { errors } } = useForm(wishlistSchema);
// Валидация автоматическая
```

### 3. Используйте TypeScript types

❌ **Плохо:**
```tsx
const handleCreate = (data: any) => {
  // ...
}
```

✅ **Хорошо:**
```tsx
import type { WishlistCreate } from './types';

const handleCreate = (data: WishlistCreate) => {
  // ...
}
```

### 4. Loading states

❌ **Плохо:**
```tsx
{wishlists.map(w => <Card />)}
```

✅ **Хорошо:**
```tsx
{isLoading ? <CardSkeleton /> : wishlists.map(w => <Card />)}
```

### 5. Error handling

❌ **Плохо:**
```tsx
await createWishlist(data);
```

✅ **Хорошо:**
```tsx
try {
  await createWishlist(data);
  success('Список создан!');
} catch (error) {
  error('Ошибка создания');
}
```

---

## 🚀 Оптимизации

### Lazy Loading

```tsx
const WishlistDetail = lazy(() => import('./pages/WishlistDetail'));
```

### Code Splitting

Автоматически через React Router + lazy()

### Memoization

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(items);
}, [items]);
```

---

## 🐛 Debugging

### Redux DevTools

Zustand поддерживает Redux DevTools:

```tsx
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(devtools(
  (set) => ({ /* ... */ }),
  { name: 'auth-store' }
));
```

### API Logging

В dev режиме все запросы логируются:

```
[API] POST /auth/login { email: "...", password: "..." }
[API] Response: { user: {...}, access_token: "..." }
```

---

## 📝 Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
NODE_ENV=development
```

Доступ в коде:

```tsx
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## 🔒 Security

### XSS Protection

- Все пользовательские данные санитизируются React
- CSP headers настроены
- Нет `dangerouslySetInnerHTML`

### CSRF Protection

- JWT токены вместо cookies
- SameSite cookies для session

### SQL Injection

- Backend использует ORM (SQLAlchemy)
- Параметризованные запросы

---

## 📚 Дополнительная документация

- `DESIGN_SYSTEM.md` - Дизайн-система
- `COMPONENTS.md` - UI компоненты
- `UI_IMPLEMENTATION.md` - Обзор реализации

---

Создано с ❤️ для проекта Wishlist

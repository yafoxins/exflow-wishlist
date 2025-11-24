# 🎨 UI Components Library

Библиотека переиспользуемых React компонентов для проекта Wishlist.

Все компоненты следуют дизайн-системе проекта ([DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)) и построены на React + TypeScript + TailwindCSS.

---

## 📦 Установка и использование

```tsx
import { Button, Input, Card, Modal } from '@/components/ui';
```

---

## 🧩 Компоненты

### Button

Универсальная кнопка с различными вариантами оформления.

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`
- `size`: `'sm' | 'md' | 'lg'`
- `fullWidth`: boolean
- `isLoading`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode

**Примеры:**

```tsx
// Основная кнопка
<Button variant="primary" onClick={handleCreate}>
  Создать список
</Button>

// Кнопка с иконкой
<Button
  variant="outline"
  leftIcon={<PlusIcon />}
>
  Добавить подарок
</Button>

// Загрузка
<Button isLoading>
  Сохранение...
</Button>

// На всю ширину
<Button fullWidth variant="secondary">
  Войти через Telegram
</Button>
```

---

### Input / Textarea

Текстовые поля ввода с поддержкой валидации и иконок.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`, `rightIcon`: React.ReactNode
- `fullWidth`: boolean

**Примеры:**

```tsx
// Простое поле
<Input
  label="Название списка"
  placeholder="Мой день рождения"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

// С иконкой и ошибкой
<Input
  label="Email"
  type="email"
  leftIcon={<EmailIcon />}
  error={errors.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Textarea
<Textarea
  label="Описание"
  rows={4}
  placeholder="Опишите ваш список..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

---

### Card, WishlistCard, ItemCard

Карточки для отображения списков и подарков.

**WishlistCard Props:**
- `title`: string (название списка)
- `description`: string
- `itemCount`: number (количество подарков)
- `eventDate`: string (дата события)
- `emoji`: string
- `gradient`: string (Tailwind gradient классы)
- `isPublic`: boolean
- `onClick`: () => void

**ItemCard Props:**
- `title`: string (название подарка)
- `price`: number
- `imageUrl`: string
- `priority`: `'low' | 'medium' | 'high'`
- `isReserved`: boolean
- `link`: string (ссылка на товар)
- `compact`: boolean (компактный вид)
- `onClick`: () => void

**Примеры:**

```tsx
// Карточка списка желаний
<WishlistCard
  title="День рождения 2025"
  description="Мои мечты на 30 лет"
  itemCount={12}
  eventDate="2025-06-15"
  emoji="🎂"
  gradient="from-purple-500 to-pink-500"
  isPublic={true}
  onClick={() => navigate(`/wishlist/${id}`)}
/>

// Карточка подарка (полная)
<ItemCard
  title="iPhone 15 Pro"
  price={99990}
  imageUrl="https://..."
  priority="high"
  isReserved={false}
  link="https://market.yandex.ru/..."
  onClick={() => viewItem(item)}
/>

// Карточка подарка (компактная)
<ItemCard
  title="iPhone 15 Pro"
  price={99990}
  compact
  onClick={() => viewItem(item)}
/>
```

---

### Badge

Компактные бейджи для статусов и тегов.

**Props:**
- `variant`: `'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'`
- `size`: `'sm' | 'md' | 'lg'`
- `dot`: boolean (показать точку)

**Примеры:**

```tsx
<Badge variant="success">Оплачен</Badge>
<Badge variant="warning" size="sm">Ожидает</Badge>
<Badge variant="info" dot>3 новых</Badge>
```

---

### Modal

Модальное окно с backdrop, анимациями и закрытием по ESC.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `description`: string
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'`
- `footer`: React.ReactNode
- `disableBackdropClose`: boolean

**Пример:**

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Добавить подарок"
  description="Заполните информацию о подарке"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Отмена
      </Button>
      <Button onClick={handleSave}>
        Сохранить
      </Button>
    </>
  }
>
  <ItemForm onSubmit={handleSubmit} />
</Modal>
```

---

### Navbar

Навигационная панель с меню, профилем и мобильной версией.

**Props:**
- `user`: `{ name, avatar?, email? }`
- `onProfileClick`: () => void
- `onLogout`: () => void
- `menuItems`: Array<{ label, icon?, onClick, active? }>

**Пример:**

```tsx
<Navbar
  user={{
    name: 'Иван Петров',
    avatar: 'https://...',
    email: 'ivan@example.com'
  }}
  menuItems={[
    {
      label: 'Мои списки',
      icon: <ListIcon />,
      onClick: () => navigate('/wishlists'),
      active: true
    },
    {
      label: 'Создать',
      icon: <PlusIcon />,
      onClick: () => navigate('/create')
    }
  ]}
  onProfileClick={() => navigate('/profile')}
  onLogout={handleLogout}
/>
```

---

### Select

Кастомный выпадающий список с поиском.

**Props:**
- `label`: string
- `options`: SelectOption[]
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `error`: string
- `searchable`: boolean

**Пример:**

```tsx
<Select
  label="Приоритет"
  options={[
    { value: 'low', label: 'Низкий', icon: '⬇️' },
    { value: 'medium', label: 'Средний', icon: '➡️' },
    { value: 'high', label: 'Высокий', icon: '⬆️' }
  ]}
  value={priority}
  onChange={setPriority}
  searchable
/>
```

---

### Avatar / AvatarGroup

Аватары пользователей с поддержкой статусов.

**Avatar Props:**
- `src`: string (URL изображения)
- `name`: string (для инициалов)
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`
- `status`: `'online' | 'offline' | 'away' | 'busy'`
- `shape`: `'circle' | 'rounded' | 'square'`

**AvatarGroup Props:**
- `users`: Array<{ src?, name }>
- `max`: number (макс. видимых)
- `size`: Avatar['size']

**Примеры:**

```tsx
// Обычный аватар
<Avatar
  src={user.avatar}
  name={user.name}
  size="lg"
  status="online"
/>

// Группа аватаров
<AvatarGroup
  users={[
    { name: 'Иван', src: '...' },
    { name: 'Мария', src: '...' },
    { name: 'Петр', src: '...' }
  ]}
  max={3}
  size="md"
/>
```

---

### Loading Components

Компоненты загрузки: спиннеры, скелетоны, индикаторы.

**Примеры:**

```tsx
// Спиннер
<Spinner size="lg" variant="primary" />

// Полноэкранный загрузчик
<PageLoader message="Загружаем ваши списки..." />

// Скелетон
<Skeleton count={3} height="h-6" />

// Скелетон карточки
<CardSkeleton />
```

---

### EmptyState

Пустые состояния для списков, поиска, ошибок.

**Props:**
- `emoji`: string
- `title`: string
- `description`: string
- `action`: React.ReactNode
- `size`: `'sm' | 'md' | 'lg'`

**Специализированные варианты:**
- `EmptyList` - пустой список
- `EmptySearch` - ничего не найдено
- `ErrorState` - ошибка
- `OfflineState` - нет подключения

**Примеры:**

```tsx
// Кастомное пустое состояние
<EmptyState
  emoji="🎁"
  title="У вас пока нет списков"
  description="Создайте свой первый список желаний"
  action={
    <Button onClick={handleCreate}>Создать список</Button>
  }
/>

// Специализированные
<EmptyList
  title="Списков пока нет"
  action={<Button>Создать</Button>}
/>

<EmptySearch description="Попробуйте изменить запрос" />

<ErrorState
  description="Не удалось загрузить данные"
  action={<Button onClick={retry}>Попробовать снова</Button>}
/>
```

---

## 🎨 Кастомизация

Все компоненты поддерживают prop `className` для дополнительной кастомизации:

```tsx
<Button className="mt-4 shadow-2xl">
  Кастомная кнопка
</Button>
```

---

## 📱 Responsive

Все компоненты адаптивны и работают на мобильных устройствах. Используются Tailwind responsive префиксы:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <WishlistCard {...props} />
  <WishlistCard {...props} />
  <WishlistCard {...props} />
</div>
```

---

## ♿ Accessibility

Компоненты следуют принципам доступности:
- Keyboard navigation (Tab, Enter, Esc)
- ARIA атрибуты
- Семантичная HTML разметка
- Focus states
- Screen reader friendly

---

## 🚀 Performance

- Lazy loading для модальных окон
- Мемоизация тяжелых компонентов
- CSS animations вместо JS
- Optimized re-renders

---

## 🎯 Best Practices

1. **Всегда используйте типы TypeScript**
   ```tsx
   const [value, setValue] = useState<string>('');
   ```

2. **Обрабатывайте ошибки**
   ```tsx
   <Input error={errors.email} />
   ```

3. **Показывайте состояния загрузки**
   ```tsx
   <Button isLoading={isSaving}>Сохранить</Button>
   ```

4. **Используйте пустые состояния**
   ```tsx
   {items.length === 0 ? <EmptyList /> : <ItemsList />}
   ```

5. **Добавляйте aria-labels для иконок**
   ```tsx
   <button aria-label="Закрыть">
     <CloseIcon />
   </button>
   ```

---

Создано с ❤️ для проекта Wishlist

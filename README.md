# 🎁 ExFlow Wishlist

[English](#english) | [Русский](#russian)

---

<a name="english"></a>

## 🇬🇧 English

**ExFlow Wishlist** is a modern web application for creating and managing wishlists (gift registries). Create multiple wishlists for different occasions, add items with descriptions, prices, and links, and invite others to view and reserve gifts. Features marketplace integration (Wildberries, Ozon, Yandex.Market) for easy product parsing.

### ✨ Key Features

- 🔐 **Multiple Authentication Methods**
  - Email + password registration
  - OAuth via Yandex ID
  - Telegram bot authentication with WebApp integration

- 🎁 **Wishlist Management**
  - Create unlimited personal wishlists
  - Set access levels: private, by-link, or public
  - Add event dates (birthdays, holidays, etc.)
  - Customize theme colors and cover images
  - Track views for each list

- 🏷️ **Gift Items**
  - Add items with title, description, price, and links
  - Auto-detect marketplace (Wildberries, Ozon, Yandex.Market)
  - Parse product info from URLs (Open Graph metadata)
  - Set priority levels (low, medium, high)
  - Track status (available, reserved, purchased)
  - Support for images and tags

- 🤝 **Reservation System**
  - Reserve gifts to prevent duplicates
  - Support for both registered users and guests
  - Optional anonymous reservations
  - Guest comments and contact info

- 🤖 **Telegram Bot Integration**
  - Embedded WebApp inside Telegram
  - Commands: `/start`, `/help`, `/my_lists`, `/add`
  - Notifications for gift reservations and important dates

- 📬 **Email Notifications**
  - Email verification for registration
  - Reservation notifications
  - Event reminders

### 🛠️ Technology Stack

**Backend**
- Python 3.11+
- FastAPI + Uvicorn (async web framework)
- SQLAlchemy 2.0 + asyncpg (async ORM)
- PostgreSQL 15 (database)
- Redis 7 (caching, sessions, tokens)
- Alembic (database migrations)
- Pydantic 2.5 (validation)
- python-telegram-bot 20.7 (Telegram integration)
- python-jose (JWT authentication)
- passlib + bcrypt (password hashing)
- BeautifulSoup4 (web scraping)

**Frontend**
- React 18 + TypeScript
- React Router 6 (routing)
- React Hook Form + Zod (form validation)
- Zustand (state management)
- TailwindCSS 3 (styling)
- Axios (HTTP client)
- Headless UI + Heroicons (UI components)

**Infrastructure**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Mailhog (development email testing)

### 📁 Project Structure

```
exflow-wishlist/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API routes (auth, wishlists, items, reservations)
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Business logic (email, telegram, parser)
│   │   ├── core/           # Security utilities
│   │   ├── config.py       # Settings from environment
│   │   └── main.py         # FastAPI app entry point
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
│
├── frontend/               # React SPA
│   ├── src/
│   │   ├── api/            # API services
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   └── Router.tsx      # React Router config
│   ├── package.json        # Node dependencies
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf          # Reverse proxy config
│
├── docker-compose.yml      # Full stack orchestration
└── README.md               # This file
```

### 🚀 Quick Start with Docker Compose

#### 1. Clone the Repository

```bash
git clone https://github.com/yafoxins/exflow-wishlist.git
cd exflow-wishlist
```

#### 2. Prepare Environment Files

Copy the template files and configure your environment:

```bash
# Backend environment
cp backend/.env.template backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env

# Docker Compose environment
cp .env.example .env
```

**Important:** Edit these files to set your own values, especially:
- `SECRET_KEY` in `backend/.env` (MUST change in production)
- Database passwords
- OAuth credentials (if using Yandex ID)
- Telegram bot token (if using Telegram integration)
- SMTP settings (for production email)

#### 3. Start the Stack

```bash
docker compose up --build
```

After startup, access:
- **Application:** http://localhost
- **Backend API:** http://localhost/api/v1
- **API Documentation:** http://localhost/docs
- **Mailhog (dev email):** http://localhost:8025

#### 4. Create Admin User (Optional)

```bash
docker compose exec backend python -m app.scripts.create_admin
```

### 💻 Local Development (without Docker)

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env         # Edit .env with your settings
alembic upgrade head
uvicorn app.main:app --reload
```

Backend will be available at http://localhost:8000

#### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env          # Set REACT_APP_API_URL=http://localhost:8000/api/v1
npm start
```

Frontend will be available at http://localhost:3000

### 🔐 Environment Variables

#### Root `.env` (for docker-compose)

```env
POSTGRES_USER=exflow_user
POSTGRES_PASSWORD=change_me_local_password
POSTGRES_DB=exflow_db
```

#### Backend `backend/.env`

Key settings (see `backend/.env.template` for full list):

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost/exflow_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Security (CHANGE IN PRODUCTION!)
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256

# OAuth (optional)
YANDEX_CLIENT_ID=your_yandex_client_id
YANDEX_CLIENT_SECRET=your_yandex_client_secret

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend `frontend/.env`

```env
# For Docker with Nginx
REACT_APP_API_URL=/api/v1

# For local development
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### 🤖 Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set `TELEGRAM_BOT_TOKEN` in `backend/.env`
4. Configure webhook URL: `TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/v1/telegram/webhook`
5. Set WebApp URL: `TELEGRAM_WEBAPP_URL=https://your-domain.com`

### 📊 Database Migrations

```bash
# Create a new migration
cd backend
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### 🧪 Running Tests

```bash
cd backend
pytest tests/
```

### 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs (or http://localhost/docs with Docker)
- **ReDoc:** http://localhost:8000/redoc

### 🔒 Security Notes

- **Never commit `.env` files** to the repository
- Always change `SECRET_KEY` in production
- Use strong passwords for database and admin accounts
- Enable HTTPS in production (configure Nginx)
- Regularly update dependencies for security patches

### 📄 License

This project is licensed under the **GPLv3 License** - see the [LICENSE](LICENSE) file for details.

### 👨‍💻 Author

Created by [@yafoxins](https://github.com/yafoxins)

- **Telegram:** [@yafoxin](https://t.me/yafoxin)
- **Channel:** [t.me/yafoxins](https://t.me/yafoxins)

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📧 Support

If you have any questions or issues, please:
1. Check the [Issues](https://github.com/yafoxins/exflow-wishlist/issues) page
2. Contact via Telegram: [@yafoxin](https://t.me/yafoxin)

---

<a name="russian"></a>

## 🇷🇺 Русский

**ExFlow Wishlist** — современное веб-приложение для создания и управления списками желаний (вишлистами). Создавайте несколько списков для разных событий, добавляйте товары с описаниями, ценами и ссылками, приглашайте других людей просматривать и бронировать подарки. Поддерживается интеграция с маркетплейсами (Wildberries, Ozon, Яндекс.Маркет) для автоматического парсинга товаров.

### ✨ Основные возможности

- 🔐 **Несколько способов авторизации**
  - Регистрация по email + пароль
  - OAuth через Яндекс ID
  - Авторизация через Telegram-бот с WebApp интеграцией

- 🎁 **Управление вишлистами**
  - Создание неограниченного количества личных списков
  - Настройка уровней доступа: приватный, по ссылке, публичный
  - Добавление дат событий (дни рождения, праздники и т.д.)
  - Настройка цветовой темы и обложки
  - Отслеживание просмотров каждого списка

- 🏷️ **Управление подарками**
  - Добавление товаров с названием, описанием, ценой и ссылками
  - Автоопределение маркетплейса (Wildberries, Ozon, Яндекс.Маркет)
  - Парсинг информации о товаре по URL (Open Graph метаданные)
  - Установка уровней приоритета (низкий, средний, высокий)
  - Отслеживание статуса (доступен, забронирован, куплен)
  - Поддержка изображений и тегов

- 🤝 **Система бронирования**
  - Бронирование подарков для предотвращения дублирования
  - Поддержка как зарегистрированных пользователей, так и гостей
  - Опциональное анонимное бронирование
  - Комментарии и контактная информация гостей

- 🤖 **Интеграция с Telegram-ботом**
  - Встроенное WebApp внутри Telegram
  - Команды: `/start`, `/help`, `/my_lists`, `/add`
  - Уведомления о бронировании подарков и важных датах

- 📬 **Email-уведомления**
  - Подтверждение email при регистрации
  - Уведомления о бронированиях
  - Напоминания о событиях

### 🛠️ Технологический стек

**Backend**
- Python 3.11+
- FastAPI + Uvicorn (асинхронный веб-фреймворк)
- SQLAlchemy 2.0 + asyncpg (асинхронная ORM)
- PostgreSQL 15 (база данных)
- Redis 7 (кеширование, сессии, токены)
- Alembic (миграции базы данных)
- Pydantic 2.5 (валидация данных)
- python-telegram-bot 20.7 (интеграция с Telegram)
- python-jose (JWT аутентификация)
- passlib + bcrypt (хеширование паролей)
- BeautifulSoup4 (веб-скрапинг)

**Frontend**
- React 18 + TypeScript
- React Router 6 (маршрутизация)
- React Hook Form + Zod (валидация форм)
- Zustand (управление состоянием)
- TailwindCSS 3 (стилизация)
- Axios (HTTP-клиент)
- Headless UI + Heroicons (UI компоненты)

**Инфраструктура**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Mailhog (тестирование email в разработке)

### 📁 Структура проекта

```
exflow-wishlist/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API роуты (auth, wishlists, items, reservations)
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── schemas/        # Pydantic схемы валидации
│   │   ├── services/       # Бизнес-логика (email, telegram, parser)
│   │   ├── core/           # Утилиты безопасности
│   │   ├── config.py       # Настройки из переменных окружения
│   │   └── main.py         # Точка входа FastAPI приложения
│   ├── alembic/            # Миграции базы данных
│   ├── requirements.txt    # Python зависимости
│   └── Dockerfile
│
├── frontend/               # React SPA
│   ├── src/
│   │   ├── api/            # API сервисы
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Компоненты страниц
│   │   ├── stores/         # Zustand хранилища
│   │   └── Router.tsx      # Конфигурация React Router
│   ├── package.json        # Node зависимости
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf          # Конфигурация reverse proxy
│
├── docker-compose.yml      # Оркестрация полного стека
└── README.md               # Этот файл
```

### 🚀 Быстрый старт с Docker Compose

#### 1. Клонирование репозитория

```bash
git clone https://github.com/yafoxins/exflow-wishlist.git
cd exflow-wishlist
```

#### 2. Подготовка файлов окружения

Скопируйте шаблоны и настройте окружение:

```bash
# Окружение backend
cp backend/.env.template backend/.env

# Окружение frontend
cp frontend/.env.example frontend/.env

# Окружение Docker Compose
cp .env.example .env
```

**Важно:** Отредактируйте эти файлы и установите свои значения, особенно:
- `SECRET_KEY` в `backend/.env` (ОБЯЗАТЕЛЬНО изменить в продакшене)
- Пароли базы данных
- OAuth учетные данные (если используете Яндекс ID)
- Токен Telegram-бота (если используете интеграцию с Telegram)
- Настройки SMTP (для продакшн email)

#### 3. Запуск стека

```bash
docker compose up --build
```

После запуска доступны:
- **Приложение:** http://localhost
- **Backend API:** http://localhost/api/v1
- **Документация API:** http://localhost/docs
- **Mailhog (dev email):** http://localhost:8025

#### 4. Создание администратора (опционально)

```bash
docker compose exec backend python -m app.scripts.create_admin
```

### 💻 Локальная разработка (без Docker)

#### Настройка Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env         # Отредактируйте .env с вашими настройками
alembic upgrade head
uvicorn app.main:app --reload
```

Backend будет доступен по адресу http://localhost:8000

#### Настройка Frontend

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env          # Установите REACT_APP_API_URL=http://localhost:8000/api/v1
npm start
```

Frontend будет доступен по адресу http://localhost:3000

### 🔐 Переменные окружения

#### Корневой `.env` (для docker-compose)

```env
POSTGRES_USER=exflow_user
POSTGRES_PASSWORD=change_me_local_password
POSTGRES_DB=exflow_db
```

#### Backend `backend/.env`

Ключевые настройки (полный список см. в `backend/.env.template`):

```env
# База данных
DATABASE_URL=postgresql+asyncpg://user:password@localhost/exflow_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Безопасность (ИЗМЕНИТЬ В ПРОДАКШЕНЕ!)
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256

# OAuth (опционально)
YANDEX_CLIENT_ID=your_yandex_client_id
YANDEX_CLIENT_SECRET=your_yandex_client_secret

# Telegram (опционально)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend `frontend/.env`

```env
# Для Docker с Nginx
REACT_APP_API_URL=/api/v1

# Для локальной разработки
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### 🤖 Настройка Telegram-бота

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Установите `TELEGRAM_BOT_TOKEN` в `backend/.env`
4. Настройте URL webhook: `TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/v1/telegram/webhook`
5. Установите URL WebApp: `TELEGRAM_WEBAPP_URL=https://your-domain.com`

### 📊 Миграции базы данных

```bash
# Создать новую миграцию
cd backend
alembic revision --autogenerate -m "Описание изменений"

# Применить миграции
alembic upgrade head

# Откатить миграцию
alembic downgrade -1
```

### 🧪 Запуск тестов

```bash
cd backend
pytest tests/
```

### 📝 Документация API

После запуска backend, доступна документация:
- **Swagger UI:** http://localhost:8000/docs (или http://localhost/docs с Docker)
- **ReDoc:** http://localhost:8000/redoc

### 🔒 Примечания по безопасности

- **Никогда не коммитьте `.env` файлы** в репозиторий
- Всегда изменяйте `SECRET_KEY` в продакшене
- Используйте надежные пароли для базы данных и админ-аккаунтов
- Включите HTTPS в продакшене (настройте Nginx)
- Регулярно обновляйте зависимости для получения патчей безопасности

### 📄 Лицензия

Этот проект распространяется под лицензией **GPLv3** - см. файл [LICENSE](LICENSE) для деталей.

### 👨‍💻 Автор

Создано [@yafoxins](https://github.com/yafoxins)

- **Telegram:** [@yafoxin](https://t.me/yafoxin)
- **Канал:** [t.me/yafoxins](https://t.me/yafoxins)

### 🤝 Вклад в проект

Вклады приветствуются! Не стесняйтесь отправлять Pull Request.

### 📧 Поддержка

Если у вас есть вопросы или проблемы:
1. Проверьте страницу [Issues](https://github.com/yafoxins/exflow-wishlist/issues)
2. Свяжитесь через Telegram: [@yafoxin](https://t.me/yafoxin)

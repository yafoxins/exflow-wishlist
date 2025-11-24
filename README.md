# 🎁 ExFlow Wishlist

**ExFlow Wishlist** — современное Python-приложение для ведения списков желаний (wishlist) с красивым UI, интеграцией с Telegram и поддержкой маркетплейсов (Wildberries, Ozon, Яндекс.Маркет).

- 🔐 Авторизация (email + пароль, OAuth через Яндекс ID, Telegram)
- 🎁 Личные и общие вишлисты
- 🏷️ Карточки хотелок с описанием, ценой, ссылками и статусами
- 🔗 Парсинг товаров по ссылке (WB, Ozon, Я.Маркет + любые сайты с Open Graph)
- 🤝 Бронирование подарков, чтобы не дарили одно и то же
- 🤖 Telegram-бот с WebApp и уведомлениями
- 📬 Email-уведомления (SMTP / Mailhog)
- 🐳 Полный Docker-стек: backend, frontend, Postgres, Redis, Mailhog, Nginx

> Автор: [@yafoxins](https://github.com/yafoxins)  
> Telegram: [@yafoxin](https://t.me/yafoxin) · Канал: [t.me/yafoxins](https://t.me/yafoxins)

---

## ⚙️ Стек

**Backend (./backend)**

- Python 3.11+
- FastAPI + Uvicorn
- SQLAlchemy 2 + asyncpg
- Alembic (миграции)
- PostgreSQL
- Redis (кеш, сессии, токены)
- Pydantic / pydantic-settings
- python-telegram-bot (Telegram-бот)
- Email (SMTP)

**Frontend (./frontend)**

- React 18 + TypeScript
- React Router
- React Hook Form + Zod
- Zustand
- TailwindCSS

**Инфра**

- Docker / Docker Compose
- Nginx (reverse proxy)
- Mailhog (dev-почта)

---

## 🧱 Архитектура проекта

```text
exflow-wishlist/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/         # auth, wishlists, items, reservations, parser, telegram
│   │   ├── models/         # SQLAlchemy модели (User, Wishlist, Item, Reservation, OAuth и т.д.)
│   │   ├── schemas/        # Pydantic-схемы
│   │   ├── services/       # email, telegram_bot, product_parser + парсеры WB/Ozon/Я.Маркет
│   │   ├── core/           # security, utils
│   │   ├── config.py       # настройки через .env
│   │   └── main.py         # точка входа FastAPI
│   ├── alembic/            # миграции БД
│   ├── .env.template       # шаблон настроек backend
│   └── Dockerfile
├── frontend/               # React SPA
│   ├── src/
│   │   ├── api/            # axios-клиент и сервисы
│   │   ├── components/     # UI-компоненты
│   │   ├── pages/          # экраны: Landing, Dashboard, WishlistDetail, PublicWishlist и др.
│   │   ├── stores/         # Zustand-сторы
│   │   └── ...
│   ├── .env.example        # шаблон настроек frontend
│   ├── Dockerfile
│   └── Dockerfile.prod
├── nginx/
│   ├── nginx.conf          # / → frontend, /api/ → backend
│   └── Dockerfile
├── docker-compose.yml      # общий docker-стек
├── INTEGRATION.md          # подробности интеграции фронта и бэка
├── LICENSE                 # GPLv3
└── .gitignore
```

---

## 🚀 Быстрый старт через Docker Compose

### 1. Клонируем репозиторий

```bash
git clone https://github.com/yafoxins/exflow-wishlist.git
cd exflow-wishlist
```

### 2. Готовим `.env` файлы

В репозитории лежат **только шаблоны**, реальные `.env` ты создаёшь локально.

```bash
# Backend
cp backend/.env.template backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# Docker Compose (корень)
cp .env.example .env
```

### 3. Запуск docker-стека

```bash
docker compose up --build
```

После запуска:

- Приложение: http://localhost  
- Backend API (через Nginx): http://localhost/api/v1  
- Swagger UI: http://localhost/docs  
- Mailhog (почта для dev): http://localhost:8025  

---

## 🔐 Переменные окружения

### Корневой `.env` (docker-compose)

Файл: **`.env.example` в корне проекта**:

```env
# Database (используется в docker-compose.yml)
POSTGRES_USER=exflow_user
POSTGRES_PASSWORD=change_me_local_password
POSTGRES_DB=exflow_db
```

### Backend: `backend/.env`

Шаблон: `backend/.env.template`.  
Реальный `backend/.env` создаётся на основе шаблона и **не коммитится**.

### Frontend: `frontend/.env`

Шаблон: `frontend/.env.example`.  
Для docker-стека через nginx:

```env
REACT_APP_API_URL=/api/v1
```

---

## 🤖 Telegram-бот

- Авторизация и привязка аккаунта
- Открытие WebApp внутри Telegram
- Уведомления о бронировании подарков и важных датах

Endpoint webhook: `POST /api/v1/telegram/webhook` (см. backend).

---

## 👨‍💻 Локальная разработка без Docker

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

---

## 🧹 Git и безопасность

- В GitHub НЕ должны попадать:
  - `backend/.env`
  - `frontend/.env`
  - корневой `.env`
- В репо остаются только:
  - `backend/.env.template`
  - `frontend/.env.example`
  - `.env.example` в корне

---

## 📄 Лицензия

Проект распространяется под лицензией **GPLv3** (см. `LICENSE`).

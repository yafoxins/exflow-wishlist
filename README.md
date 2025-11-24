<div align="center">

# 🎁 ExFlow Wishlist

### Современная платформа управления списками желаний<br>Modern Wishlist Management Platform

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

<br>

### Выберите язык / Choose Language

<table>
<tr>
<td align="center" width="50%">
<a href="#russian">
<img src="https://img.shields.io/badge/🇷🇺_Русский-Читать_на_русском-0088CC?style=for-the-badge" alt="Русский">
</a>
</td>
<td align="center" width="50%">
<a href="#english">
<img src="https://img.shields.io/badge/🇬🇧_English-Read_in_English-0088CC?style=for-the-badge" alt="English">
</a>
</td>
</tr>
</table>

</div>

<br>
<br>

---

<a name="russian"></a>

<div align="center">

# 🇷🇺 РУССКАЯ ВЕРСИЯ

### Создавайте, делитесь и управляйте списками желаний легко

<br>

[🇬🇧 Switch to English](#english)

</div>

<br>

## 📖 Содержание

- [🎯 О проекте](#about-ru)
- [✨ Основные возможности](#features-ru)
- [🛠️ Технологический стек](#tech-stack-ru)
- [🚀 Быстрый старт](#quick-start-ru)
- [💻 Локальная разработка](#dev-ru)
- [⚙️ Конфигурация](#config-ru)
- [📚 Документация](#docs-ru)
- [🔒 Безопасность](#security-ru)
- [🤝 Вклад в проект](#contribute-ru)
- [📄 Лицензия](#license-ru)

<br>

---

<a name="about-ru"></a>

## 🎯 О проекте

**ExFlow Wishlist** — это современное, многофункциональное веб-приложение для создания и управления списками желаний (вишлистами). Идеально подходит для дней рождения, праздников, свадеб или любых особых событий.

<br>

### 🌟 Почему ExFlow Wishlist?

<table>
<tr>
<td align="center" width="25%">
<h3>🛍️</h3>
<b>Интеграция с маркетплейсами</b>
<br><br>
Автоматический парсинг товаров с Wildberries, Ozon и Яндекс.Маркет
</td>
<td align="center" width="25%">
<h3>📱</h3>
<b>Telegram-бот</b>
<br><br>
Управляйте вишлистами прямо из Telegram с WebApp интеграцией
</td>
<td align="center" width="25%">
<h3>🔗</h3>
<b>Умная публикация</b>
<br><br>
Несколько уровней доступа: приватный, по ссылке, публичный
</td>
<td align="center" width="25%">
<h3>🎨</h3>
<b>Кастомизация</b>
<br><br>
Персонализируйте темами, цветами и обложками
</td>
</tr>
</table>

<br>

---

<a name="features-ru"></a>

## ✨ Основные возможности

<table>
<tr>
<td width="50%">

### 🔐 Аутентификация
<img src="https://img.shields.io/badge/-Безопасно-success?style=flat-square" alt="Secure">

- ✅ Регистрация по email + пароль
- ✅ OAuth через Яндекс ID
- ✅ Авторизация через Telegram-бот
- ✅ JWT-токены с автообновлением
- ✅ Подтверждение email

</td>
<td width="50%">

### 🎁 Управление вишлистами
<img src="https://img.shields.io/badge/-Гибко-informational?style=flat-square" alt="Flexible">

- ✅ Неограниченное количество списков
- ✅ Контроль доступа (приватный/ссылка/публичный)
- ✅ Даты событий и напоминания
- ✅ Кастомные темы и обложки
- ✅ Аналитика просмотров

</td>
</tr>
<tr>
<td width="50%">

### 🏷️ Управление подарками
<img src="https://img.shields.io/badge/-Удобно-blueviolet?style=flat-square" alt="Convenient">

- ✅ Подробные описания товаров
- ✅ Отслеживание цен и ссылок
- ✅ Автоопределение маркетплейса
- ✅ Уровни приоритета (низкий/средний/высокий)
- ✅ Множественные изображения

</td>
<td width="50%">

### 🤝 Система бронирования
<img src="https://img.shields.io/badge/-Умно-orange?style=flat-square" alt="Smart">

- ✅ Предотвращение дублирования подарков
- ✅ Бронирование гостями и пользователями
- ✅ Анонимный режим
- ✅ Комментарии и контакты
- ✅ Обновления в реальном времени

</td>
</tr>
<tr>
<td width="50%">

### 🤖 Telegram-интеграция
<img src="https://img.shields.io/badge/-Telegram-26A5E4?style=flat-square&logo=telegram&logoColor=white" alt="Telegram">

- ✅ Встроенное WebApp
- ✅ Команды бота: `/start`, `/help`, `/my_lists`
- ✅ Push-уведомления
- ✅ Оповещения о бронировании
- ✅ Напоминания о событиях

</td>
<td width="50%">

### 📬 Уведомления
<img src="https://img.shields.io/badge/-Email-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email">

- ✅ Подтверждение email
- ✅ Оповещения о бронировании
- ✅ Напоминания о событиях
- ✅ Поддержка SMTP
- ✅ Режим разработки (Mailhog)

</td>
</tr>
</table>

<br>

---

<a name="tech-stack-ru"></a>

## 🛠️ Технологический стек

<div align="center">

### Backend Technologies

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### Frontend Technologies

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### DevOps & Tools

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

</div>

<br>

<details>
<summary><b>📋 Подробный список технологий</b></summary>

<br>

#### 🐍 Backend

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| **Язык** | Python | 3.11+ |
| **Веб-фреймворк** | FastAPI + Uvicorn | - |
| **База данных** | PostgreSQL | 15 |
| **ORM** | SQLAlchemy | 2.0 |
| **Миграции** | Alembic | - |
| **Кеш** | Redis | 7 |
| **Валидация** | Pydantic | 2.5 |
| **Аутентификация** | JWT (python-jose) | - |
| **Пароли** | bcrypt + passlib | - |
| **Telegram** | python-telegram-bot | 20.7 |
| **Парсинг** | BeautifulSoup4 | - |

#### ⚛️ Frontend

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| **Язык** | TypeScript | 5.0+ |
| **Фреймворк** | React | 18 |
| **Роутинг** | React Router | 6 |
| **Формы** | React Hook Form + Zod | - |
| **Состояние** | Zustand | - |
| **Стилизация** | TailwindCSS | 3 |
| **HTTP-клиент** | Axios | - |
| **UI** | Headless UI + Heroicons | - |

#### 🐳 Инфраструктура

| Компонент | Технология |
|-----------|-----------|
| **Контейнеризация** | Docker + Docker Compose |
| **Веб-сервер** | Nginx |
| **Dev Email** | Mailhog |

</details>

<br>

### 🏗️ Архитектура сервисов

```
┌─────────────────────────────────────────────────────────┐
│                    🌐 Nginx (Reverse Proxy)              │
│                     Port 80 / 443                        │
└────────────┬────────────────────────┬────────────────────┘
             │                        │
             ▼                        ▼
    ┌────────────────┐      ┌─────────────────┐
    │  ⚛️ Frontend   │      │  🐍 Backend     │
    │  React SPA     │      │  FastAPI        │
    │  Port 3000     │      │  Port 8000      │
    └────────────────┘      └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            ┌───────────────┐ ┌──────────┐  ┌──────────────┐
            │ 🗄️ PostgreSQL │ │ 📦 Redis │  │ 📧 Mailhog   │
            │   Database    │ │  Cache   │  │  Dev Email   │
            │   Port 5432   │ │ Port 6379│  │  Port 8025   │
            └───────────────┘ └──────────┘  └──────────────┘
```

<br>

---

<a name="quick-start-ru"></a>

## 🚀 Быстрый старт

### 📦 Docker Compose (рекомендуется)

<details open>
<summary><b>Развернуть инструкцию</b></summary>

<br>

#### Шаг 1️⃣: Клонирование репозитория

```bash
git clone https://github.com/yafoxins/exflow-wishlist.git
cd exflow-wishlist
```

#### Шаг 2️⃣: Подготовка файлов окружения

```bash
# Копируем шаблоны
cp backend/.env.template backend/.env
cp frontend/.env.example frontend/.env
cp .env.example .env

# Редактируем конфигурацию
nano backend/.env  # или vim, code и т.д.
```

> ⚠️ **Важно:** Обязательно измените `SECRET_KEY` в `backend/.env` для продакшена!

#### Шаг 3️⃣: Запуск приложения

```bash
docker compose up --build
```

#### Шаг 4️⃣: Доступ к приложению

<table>
<tr>
<td align="center" width="25%">
<h3>🌐</h3>
<b>Приложение</b><br>
<a href="http://localhost">localhost</a>
</td>
<td align="center" width="25%">
<h3>🔧</h3>
<b>API</b><br>
<a href="http://localhost/api/v1">localhost/api/v1</a>
</td>
<td align="center" width="25%">
<h3>📚</h3>
<b>Документация</b><br>
<a href="http://localhost/docs">localhost/docs</a>
</td>
<td align="center" width="25%">
<h3>📧</h3>
<b>Mailhog</b><br>
<a href="http://localhost:8025">localhost:8025</a>
</td>
</tr>
</table>

#### Шаг 5️⃣ (опционально): Создание администратора

```bash
docker compose exec backend python -m app.scripts.create_admin
```

</details>

<br>

---

<a name="dev-ru"></a>

## 💻 Локальная разработка

<details>
<summary><b>🐍 Настройка Backend</b></summary>

<br>

```bash
# Переход в директорию
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Установка зависимостей
pip install -r requirements.txt

# Настройка окружения
cp .env.template .env
# Отредактируйте .env

# Применение миграций
alembic upgrade head

# Запуск сервера
uvicorn app.main:app --reload
```

✅ **Backend доступен:** http://localhost:8000

</details>

<details>
<summary><b>⚛️ Настройка Frontend</b></summary>

<br>

```bash
# Переход в директорию
cd frontend

# Установка зависимостей
npm install --legacy-peer-deps

# Настройка окружения
cp .env.example .env
# Установите REACT_APP_API_URL=http://localhost:8000/api/v1

# Запуск сервера
npm start
```

✅ **Frontend доступен:** http://localhost:3000

</details>

<br>

---

<a name="config-ru"></a>

## ⚙️ Конфигурация

<details>
<summary><b>🔐 Переменные окружения</b></summary>

<br>

### Корневой `.env`

```env
POSTGRES_USER=exflow_user
POSTGRES_PASSWORD=ваш_надёжный_пароль_здесь
POSTGRES_DB=exflow_db
```

### Backend `.env`

```env
# База данных
DATABASE_URL=postgresql+asyncpg://user:password@localhost/exflow_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Безопасность ⚠️ ИЗМЕНИТЬ!
SECRET_KEY=ваш-супер-секретный-ключ-измените-это
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=30

# OAuth (опционально)
YANDEX_CLIENT_ID=ваш_client_id
YANDEX_CLIENT_SECRET=ваш_client_secret

# Telegram (опционально)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHI...
TELEGRAM_WEBHOOK_URL=https://ваш-домен.com/api/v1/telegram/webhook

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ваш-email@gmail.com
SMTP_PASSWORD=ваш-пароль-приложения
```

### Frontend `.env`

```env
# Для Docker
REACT_APP_API_URL=/api/v1

# Для локальной разработки
REACT_APP_API_URL=http://localhost:8000/api/v1
```

</details>

<details>
<summary><b>🤖 Настройка Telegram-бота</b></summary>

<br>

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен
3. Добавьте токен в `backend/.env`
4. Настройте webhook URL
5. Перезапустите backend

📖 Подробная инструкция в [документации](#docs-ru)

</details>

<br>

---

<a name="docs-ru"></a>

## 📚 Документация

### 📖 API Документация

После запуска backend доступна по адресам:
- **Swagger UI:** http://localhost:8000/docs (интерактивная документация)
- **ReDoc:** http://localhost:8000/redoc (альтернативный формат)

### 🗄️ Миграции базы данных

```bash
# Создать миграцию
cd backend
alembic revision --autogenerate -m "Описание"

# Применить
alembic upgrade head

# Откатить
alembic downgrade -1

# История
alembic history
```

### 🧪 Тестирование

```bash
cd backend
pytest tests/ -v
```

<br>

---

<a name="security-ru"></a>

## 🔒 Безопасность

| ⚠️ Требование | Описание |
|--------------|----------|
| **`.env` файлы** | Никогда не коммитьте в репозиторий |
| **SECRET_KEY** | Обязательно измените в продакшене |
| **Пароли** | Используйте надёжные пароли (20+ символов) |
| **HTTPS** | Включите SSL/TLS в продакшене |
| **Обновления** | Регулярно обновляйте зависимости |
| **Токены** | Храните в безопасности OAuth и API токены |

<br>

---

<a name="contribute-ru"></a>

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта!

```bash
# 1. Форкните репозиторий
# 2. Создайте ветку
git checkout -b feature/АмазингФича

# 3. Внесите изменения и закоммитьте
git commit -m 'Добавить АмазингФичу'

# 4. Запуште изменения
git push origin feature/АмазингФича

# 5. Откройте Pull Request
```

<br>

---

<a name="license-ru"></a>

## 📄 Лицензия

Проект распространяется под лицензией **GNU General Public License v3.0**

См. файл [LICENSE](LICENSE) для подробностей.

<br>

---

## 👨‍💻 Автор

<div align="center">

**Создано с ❤️ [@yafoxins](https://github.com/yafoxins)**

<br>

[![Telegram](https://img.shields.io/badge/Telegram-@yafoxin-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/yafoxin)
[![Channel](https://img.shields.io/badge/Канал-@yafoxins-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/yafoxins)

<br>

### 📧 Поддержка

🐛 [Issues](https://github.com/yafoxins/exflow-wishlist/issues) · 💬 [Telegram](https://t.me/yafoxin)

⭐ **Поставьте звезду, если проект вам полезен!**

</div>

<br>
<br>

---

---

---

<br>
<br>

<a name="english"></a>

<div align="center">

# 🇬🇧 ENGLISH VERSION

### Create, Share, and Manage Gift Wishlists with Ease

<br>

[🇷🇺 Переключить на русский](#russian)

</div>

<br>

## 📖 Table of Contents

- [🎯 About](#about-en)
- [✨ Key Features](#features-en)
- [🛠️ Technology Stack](#tech-stack-en)
- [🚀 Quick Start](#quick-start-en)
- [💻 Local Development](#dev-en)
- [⚙️ Configuration](#config-en)
- [📚 Documentation](#docs-en)
- [🔒 Security](#security-en)
- [🤝 Contributing](#contribute-en)
- [📄 License](#license-en)

<br>

---

<a name="about-en"></a>

## 🎯 About

**ExFlow Wishlist** is a modern, feature-rich web application for creating and managing wishlists (gift registries). Perfect for birthdays, holidays, weddings, or any special occasion.

<br>

### 🌟 Why ExFlow Wishlist?

<table>
<tr>
<td align="center" width="25%">
<h3>🛍️</h3>
<b>Marketplace Integration</b>
<br><br>
Automatic product parsing from Wildberries, Ozon, and Yandex.Market
</td>
<td align="center" width="25%">
<h3>📱</h3>
<b>Telegram Bot</b>
<br><br>
Manage wishlists directly from Telegram with WebApp integration
</td>
<td align="center" width="25%">
<h3>🔗</h3>
<b>Smart Sharing</b>
<br><br>
Multiple access levels: private, by-link, public
</td>
<td align="center" width="25%">
<h3>🎨</h3>
<b>Customizable</b>
<br><br>
Personalize with themes, colors, and cover images
</td>
</tr>
</table>

<br>

---

<a name="features-en"></a>

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
<img src="https://img.shields.io/badge/-Secure-success?style=flat-square" alt="Secure">

- ✅ Email + password registration
- ✅ OAuth via Yandex ID
- ✅ Telegram bot authentication
- ✅ JWT tokens with auto-refresh
- ✅ Email verification

</td>
<td width="50%">

### 🎁 Wishlist Management
<img src="https://img.shields.io/badge/-Flexible-informational?style=flat-square" alt="Flexible">

- ✅ Unlimited personal wishlists
- ✅ Access control (private/link/public)
- ✅ Event dates & reminders
- ✅ Custom themes & covers
- ✅ View analytics

</td>
</tr>
<tr>
<td width="50%">

### 🏷️ Gift Items
<img src="https://img.shields.io/badge/-Convenient-blueviolet?style=flat-square" alt="Convenient">

- ✅ Rich item descriptions
- ✅ Price tracking & links
- ✅ Marketplace auto-detection
- ✅ Priority levels (low/medium/high)
- ✅ Multi-image support

</td>
<td width="50%">

### 🤝 Reservation System
<img src="https://img.shields.io/badge/-Smart-orange?style=flat-square" alt="Smart">

- ✅ Prevent duplicate gifts
- ✅ Guest & user reservations
- ✅ Anonymous mode
- ✅ Comments & contact info
- ✅ Real-time updates

</td>
</tr>
<tr>
<td width="50%">

### 🤖 Telegram Integration
<img src="https://img.shields.io/badge/-Telegram-26A5E4?style=flat-square&logo=telegram&logoColor=white" alt="Telegram">

- ✅ Embedded WebApp
- ✅ Bot commands: `/start`, `/help`, `/my_lists`
- ✅ Push notifications
- ✅ Reservation alerts
- ✅ Event reminders

</td>
<td width="50%">

### 📬 Notifications
<img src="https://img.shields.io/badge/-Email-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email">

- ✅ Email verification
- ✅ Reservation alerts
- ✅ Event reminders
- ✅ SMTP support
- ✅ Development mode (Mailhog)

</td>
</tr>
</table>

<br>

---

<a name="tech-stack-en"></a>

## 🛠️ Technology Stack

<div align="center">

### Backend Technologies

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### Frontend Technologies

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### DevOps & Tools

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

</div>

<br>

<details>
<summary><b>📋 Detailed Technology List</b></summary>

<br>

#### 🐍 Backend

| Component | Technology | Version |
|-----------|-----------|---------|
| **Language** | Python | 3.11+ |
| **Web Framework** | FastAPI + Uvicorn | - |
| **Database** | PostgreSQL | 15 |
| **ORM** | SQLAlchemy | 2.0 |
| **Migrations** | Alembic | - |
| **Cache** | Redis | 7 |
| **Validation** | Pydantic | 2.5 |
| **Authentication** | JWT (python-jose) | - |
| **Passwords** | bcrypt + passlib | - |
| **Telegram** | python-telegram-bot | 20.7 |
| **Parsing** | BeautifulSoup4 | - |

#### ⚛️ Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| **Language** | TypeScript | 5.0+ |
| **Framework** | React | 18 |
| **Routing** | React Router | 6 |
| **Forms** | React Hook Form + Zod | - |
| **State** | Zustand | - |
| **Styling** | TailwindCSS | 3 |
| **HTTP Client** | Axios | - |
| **UI** | Headless UI + Heroicons | - |

#### 🐳 Infrastructure

| Component | Technology |
|-----------|-----------|
| **Containerization** | Docker + Docker Compose |
| **Web Server** | Nginx |
| **Dev Email** | Mailhog |

</details>

<br>

### 🏗️ Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    🌐 Nginx (Reverse Proxy)              │
│                     Port 80 / 443                        │
└────────────┬────────────────────────┬────────────────────┘
             │                        │
             ▼                        ▼
    ┌────────────────┐      ┌─────────────────┐
    │  ⚛️ Frontend   │      │  🐍 Backend     │
    │  React SPA     │      │  FastAPI        │
    │  Port 3000     │      │  Port 8000      │
    └────────────────┘      └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            ┌───────────────┐ ┌──────────┐  ┌──────────────┐
            │ 🗄️ PostgreSQL │ │ 📦 Redis │  │ 📧 Mailhog   │
            │   Database    │ │  Cache   │  │  Dev Email   │
            │   Port 5432   │ │ Port 6379│  │  Port 8025   │
            └───────────────┘ └──────────┘  └──────────────┘
```

<br>

---

<a name="quick-start-en"></a>

## 🚀 Quick Start

### 📦 Docker Compose (recommended)

<details open>
<summary><b>Expand instructions</b></summary>

<br>

#### Step 1️⃣: Clone the repository

```bash
git clone https://github.com/yafoxins/exflow-wishlist.git
cd exflow-wishlist
```

#### Step 2️⃣: Prepare environment files

```bash
# Copy templates
cp backend/.env.template backend/.env
cp frontend/.env.example frontend/.env
cp .env.example .env

# Edit configuration
nano backend/.env  # or vim, code, etc.
```

> ⚠️ **Important:** Change `SECRET_KEY` in `backend/.env` for production!

#### Step 3️⃣: Start the application

```bash
docker compose up --build
```

#### Step 4️⃣: Access the application

<table>
<tr>
<td align="center" width="25%">
<h3>🌐</h3>
<b>Application</b><br>
<a href="http://localhost">localhost</a>
</td>
<td align="center" width="25%">
<h3>🔧</h3>
<b>API</b><br>
<a href="http://localhost/api/v1">localhost/api/v1</a>
</td>
<td align="center" width="25%">
<h3>📚</h3>
<b>Documentation</b><br>
<a href="http://localhost/docs">localhost/docs</a>
</td>
<td align="center" width="25%">
<h3>📧</h3>
<b>Mailhog</b><br>
<a href="http://localhost:8025">localhost:8025</a>
</td>
</tr>
</table>

#### Step 5️⃣ (optional): Create admin user

```bash
docker compose exec backend python -m app.scripts.create_admin
```

</details>

<br>

---

<a name="dev-en"></a>

## 💻 Local Development

<details>
<summary><b>🐍 Backend Setup</b></summary>

<br>

```bash
# Navigate to directory
cd backend

# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.template .env
# Edit .env

# Apply migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

✅ **Backend available at:** http://localhost:8000

</details>

<details>
<summary><b>⚛️ Frontend Setup</b></summary>

<br>

```bash
# Navigate to directory
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:8000/api/v1

# Start server
npm start
```

✅ **Frontend available at:** http://localhost:3000

</details>

<br>

---

<a name="config-en"></a>

## ⚙️ Configuration

<details>
<summary><b>🔐 Environment Variables</b></summary>

<br>

### Root `.env`

```env
POSTGRES_USER=exflow_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=exflow_db
```

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost/exflow_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Security ⚠️ CHANGE THIS!
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=30

# OAuth (optional)
YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret

# Telegram (optional)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHI...
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/v1/telegram/webhook

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend `.env`

```env
# For Docker
REACT_APP_API_URL=/api/v1

# For local development
REACT_APP_API_URL=http://localhost:8000/api/v1
```

</details>

<details>
<summary><b>🤖 Telegram Bot Setup</b></summary>

<br>

1. Create bot via [@BotFather](https://t.me/BotFather)
2. Get your token
3. Add token to `backend/.env`
4. Configure webhook URL
5. Restart backend

📖 Detailed guide in [documentation](#docs-en)

</details>

<br>

---

<a name="docs-en"></a>

## 📚 Documentation

### 📖 API Documentation

Once backend is running, available at:
- **Swagger UI:** http://localhost:8000/docs (interactive documentation)
- **ReDoc:** http://localhost:8000/redoc (alternative format)

### 🗄️ Database Migrations

```bash
# Create migration
cd backend
alembic revision --autogenerate -m "Description"

# Apply
alembic upgrade head

# Rollback
alembic downgrade -1

# History
alembic history
```

### 🧪 Testing

```bash
cd backend
pytest tests/ -v
```

<br>

---

<a name="security-en"></a>

## 🔒 Security

| ⚠️ Requirement | Description |
|---------------|-------------|
| **`.env` files** | Never commit to repository |
| **SECRET_KEY** | Must change in production |
| **Passwords** | Use strong passwords (20+ characters) |
| **HTTPS** | Enable SSL/TLS in production |
| **Updates** | Regularly update dependencies |
| **Tokens** | Keep OAuth and API tokens secure |

<br>

---

<a name="contribute-en"></a>

## 🤝 Contributing

We welcome contributions!

```bash
# 1. Fork the repository
# 2. Create a branch
git checkout -b feature/AmazingFeature

# 3. Make changes and commit
git commit -m 'Add AmazingFeature'

# 4. Push changes
git push origin feature/AmazingFeature

# 5. Open Pull Request
```

<br>

---

<a name="license-en"></a>

## 📄 License

This project is licensed under **GNU General Public License v3.0**

See [LICENSE](LICENSE) file for details.

<br>

---

## 👨‍💻 Author

<div align="center">

**Created with ❤️ by [@yafoxins](https://github.com/yafoxins)**

<br>

[![Telegram](https://img.shields.io/badge/Telegram-@yafoxin-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/yafoxin)
[![Channel](https://img.shields.io/badge/Channel-@yafoxins-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/yafoxins)

<br>

### 📧 Support

🐛 [Issues](https://github.com/yafoxins/exflow-wishlist/issues) · 💬 [Telegram](https://t.me/yafoxin)

⭐ **Star this repo if you find it useful!**

</div>

<br>

---

<div align="center">

**Made with ❤️ for the community**

![Visitors](https://api.visitorbadge.io/api/visitors?path=yafoxins%2Fexflow-wishlist&label=Visitors&countColor=%23263759&style=flat)

</div>

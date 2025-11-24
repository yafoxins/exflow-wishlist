"""
Конфигурация приложения Wishlist
Все настройки загружаются из переменных окружения через .env файл
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Основные настройки приложения"""

    # Приложение
    APP_NAME: str = "Wishlist"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Backend URL (для редиректов OAuth)
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"

    # База данных PostgreSQL
    POSTGRES_USER: str = "wishlist"
    POSTGRES_PASSWORD: str = "wishlist_password"
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "wishlist_db"

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0

    @property
    def REDIS_URL(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"  # ОБЯЗАТЕЛЬНО ИЗМЕНИТЬ в продакшене!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 часа
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30  # 30 дней

    # OAuth - Яндекс ID
    YANDEX_CLIENT_ID: str | None = None
    YANDEX_CLIENT_SECRET: str | None = None
    YANDEX_OAUTH_URL: str = "https://oauth.yandex.ru/authorize"
    YANDEX_TOKEN_URL: str = "https://oauth.yandex.ru/token"
    YANDEX_API_URL: str = "https://login.yandex.ru/info"

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str | None = None
    TELEGRAM_WEBHOOK_URL: str | None = None  # Например: https://yourdomain.com/api/v1/telegram/webhook
    TELEGRAM_WEBAPP_URL: str | None = None   # URL для WebApp

    # Email (SMTP)
    SMTP_HOST: str = "mailhog"  # для dev - mailhog, для prod - реальный SMTP
    SMTP_PORT: int = 1025
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM: str = "noreply@wishlist.app"
    SMTP_FROM_NAME: str = "Wishlist"
    SMTP_TLS: bool = False
    SMTP_SSL: bool = False

    # Загрузка файлов
    UPLOAD_DIR: str = "/app/uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS: list = [".jpg", ".jpeg", ".png", ".gif", ".webp"]

    # CORS
    CORS_ORIGINS: list = [
        "https://exflow.ru",
        "http://localhost:3000",
        "http://localhost",
        "https://web.telegram.org"  # Для Telegram WebApp
    ]

    # Парсеры (опционально - можно добавить API ключи для официальных API)
    WILDBERRIES_API_KEY: str | None = None
    OZON_API_KEY: str | None = None
    YANDEX_MARKET_API_KEY: str | None = None

    # Админка
    ADMIN_EMAIL: str = "admin@wishlist.app"
    ADMIN_PASSWORD: str = "admin"  # ОБЯЗАТЕЛЬНО ИЗМЕНИТЬ!

    class Config:
        env_file = ".env"
        case_sensitive = True


# Создаём глобальный экземпляр настроек
settings = Settings()

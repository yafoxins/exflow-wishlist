"""
Главный файл FastAPI приложения Wishlist
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.config import settings
from app.services.telegram_bot import wishlist_bot


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events"""
    # Startup
    print("🚀 Starting Wishlist API...")

    # Инициализация Telegram бота
    if settings.TELEGRAM_BOT_TOKEN:
        try:
            bot_app = wishlist_bot.initialize()
            await bot_app.initialize()
            print("✅ Telegram bot initialized")
        except Exception as e:
            print(f"⚠️  Telegram bot initialization failed: {e}")

    yield

    # Shutdown
    print("👋 Shutting down Wishlist API...")


# Создание приложения
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API для сервиса списков желаний",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Корневой endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check для мониторинга"""
    return {"status": "healthy"}

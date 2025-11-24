"""
Настройка подключения к базе данных
Используем SQLAlchemy 2.0 с async поддержкой
"""
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# Создаём async движок для PostgreSQL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Логирование SQL запросов в DEBUG режиме
    pool_pre_ping=True,   # Проверка соединения перед использованием
    pool_size=10,
    max_overflow=20
)

# Фабрика сессий
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)


# Базовый класс для всех моделей
class Base(DeclarativeBase):
    """Базовый класс для SQLAlchemy моделей"""
    pass


# Dependency для получения сессии БД в эндпоинтах
async def get_db() -> AsyncSession:
    """
    Зависимость для получения сессии базы данных
    Используется в FastAPI endpoints через Depends(get_db)
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

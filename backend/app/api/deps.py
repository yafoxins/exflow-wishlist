"""
Зависимости для API endpoints

Здесь находятся функции-зависимости для FastAPI,
которые используются для аутентификации, получения сессии БД и т.д.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.database import get_db
from app.models.user import User

# HTTP Bearer для получения токена из заголовка Authorization
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Получение текущего пользователя из JWT токена

    Args:
        credentials: JWT токен из заголовка Authorization
        db: Сессия базы данных

    Returns:
        Объект User

    Raises:
        HTTPException: Если токен невалиден или пользователь не найден
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Декодируем токен
        token = credentials.credentials
        payload = decode_token(token)
        user_id: int = payload.get("user_id")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception from None

    # Получаем пользователя из БД
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь заблокирован"
        )

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Получение активного пользователя"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Неактивный пользователь"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Получение администратора"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав"
        )
    return current_user


async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db)
) -> User | None:
    """
    Получение пользователя, если он авторизован
    Не выбрасывает исключение, если токена нет

    Используется для публичных endpoints, которые имеют разное поведение
    для авторизованных и неавторизованных пользователей
    """
    if credentials is None:
        return None

    try:
        token = credentials.credentials
        payload = decode_token(token)
        user_id: int = payload.get("user_id")

        if user_id is None:
            return None

        # ИСПРАВЛЕНО: добавлен await для async функции
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        return user if user and user.is_active else None

    except Exception:
        # ИСПРАВЛЕНО: явный except Exception вместо голого except
        return None

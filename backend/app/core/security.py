"""
Модуль безопасности: JWT токены, хэширование паролей
"""
from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

# Контекст для хэширования паролей (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Проверка пароля

    Args:
        plain_password: Пароль в открытом виде
        hashed_password: Хэш пароля из БД

    Returns:
        True если пароль верный, иначе False
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Хэширование пароля

    Args:
        password: Пароль в открытом виде

    Returns:
        Хэш пароля
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Создание JWT access токена

    Args:
        data: Данные для кодирования в токен (обычно user_id)
        expires_delta: Время жизни токена (по умолчанию из настроек)

    Returns:
        JWT токен
    """
    to_encode = data.copy()

    # ИСПРАВЛЕНО: используем datetime.now(timezone.utc) вместо deprecated utcnow()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Создание JWT refresh токена

    Args:
        data: Данные для кодирования в токен

    Returns:
        JWT refresh токен
    """
    to_encode = data.copy()
    # ИСПРАВЛЕНО: используем datetime.now(timezone.utc)
    expire = datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    """
    Декодирование JWT токена

    Args:
        token: JWT токен

    Returns:
        Декодированные данные

    Raises:
        JWTError: Если токен невалидный
    """
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    return payload


def create_email_verification_token(email: str) -> str:
    """
    Создание токена для подтверждения email

    Args:
        email: Email пользователя

    Returns:
        Токен подтверждения
    """
    data = {"sub": email, "type": "email_verification"}
    # ИСПРАВЛЕНО: используем datetime.now(timezone.utc)
    expire = datetime.now(UTC) + timedelta(hours=24)  # 24 часа
    data.update({"exp": expire})

    return jwt.encode(data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_email_token(token: str) -> str | None:
    """
    Проверка токена подтверждения email

    Args:
        token: Токен подтверждения

    Returns:
        Email пользователя или None если токен невалидный
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")

        if email is None or token_type != "email_verification":
            return None

        return email
    except JWTError:
        return None

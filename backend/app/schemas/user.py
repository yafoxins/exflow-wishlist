"""
Pydantic схемы для пользователя
"""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    """Базовая схема пользователя"""
    email: EmailStr | None = None
    username: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None
    birth_date: date | None = None


class UserCreate(UserBase):
    """Создание пользователя"""
    password: str


class UserUpdate(BaseModel):
    """Обновление профиля"""
    full_name: str | None = None
    username: str | None = None
    avatar_url: str | None = None
    birth_date: date | None = None


class User(UserBase):
    """Схема пользователя (ответ API)"""
    id: int
    is_active: bool
    is_verified: bool
    telegram_id: int | None = None
    telegram_username: str | None = None
    created_at: datetime
    last_login: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class UserProfile(User):
    """Расширенный профиль пользователя"""
    wishlists_count: int = 0
    items_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class UserPublic(BaseModel):
    """Публичная информация о пользователе"""
    id: int
    username: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None

    model_config = ConfigDict(from_attributes=True)

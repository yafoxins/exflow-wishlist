"""
Модель пользователя
"""
from datetime import UTC, datetime

from sqlalchemy import Boolean, Date, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    """
    Модель пользователя системы

    Может регистрироваться через:
    - Email/пароль (классический способ)
    - Яндекс ID (OAuth)
    - Telegram (через login widget или бота)
    """
    __tablename__ = "users"

    # Основные поля
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=True)

    # Хэш пароля (для классической регистрации)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=True)

    # Персональные данные
    full_name: Mapped[str] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    birth_date: Mapped[datetime] = mapped_column(Date, nullable=True)

    # Telegram данные (если авторизация через Telegram)
    telegram_id: Mapped[int] = mapped_column(unique=True, index=True, nullable=True)
    telegram_username: Mapped[str] = mapped_column(String(100), nullable=True)

    # Статусы
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)  # Подтверждение email
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Relationships (связи с другими таблицами)
    oauth_accounts: Mapped[list["OAuthAccount"]] = relationship(
        "OAuthAccount",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    wishlists: Mapped[list["Wishlist"]] = relationship(
        "Wishlist",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.id}: {self.email or self.username}>"

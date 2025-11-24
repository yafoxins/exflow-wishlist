"""
Модель списка желаний (Wishlist)
"""
from datetime import UTC, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WishlistAccessType(str, Enum):
    """Тип доступа к списку желаний"""
    private = "private"      # Только владелец
    by_link = "by_link"      # Доступен по ссылке
    public = "public"        # Публичный (в каталоге)


class Wishlist(Base):
    """
    Список желаний пользователя

    Примеры:
    - "Мой День рождения 2026"
    - "Новый год"
    - "Хочу купить в этом году"
    """
    __tablename__ = "wishlists"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Владелец списка
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Основная информация
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    emoji: Mapped[str] = mapped_column(String(10), nullable=True, default="🎁")

    # Slug для красивых URL (например: moy-den-rozhdeniya-2026)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)

    # Дата события (опционально - для привязки к ДР, Новому году и т.д.)
    event_date: Mapped[datetime] = mapped_column(Date, nullable=True)

    # Тип доступа
    access_type: Mapped[WishlistAccessType] = mapped_column(
        SQLEnum(WishlistAccessType),
        default=WishlistAccessType.private,
        nullable=False
    )

    # Оформление (цвет акцента, тема)
    theme_color: Mapped[str] = mapped_column(String(20), default="#6366f1", nullable=True)  # Индиго по умолчанию
    cover_image_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # Настройки видимости для гостей
    show_reservations_to_owner: Mapped[bool] = mapped_column(default=True)  # Показывать владельцу, кто забронировал
    allow_reservations: Mapped[bool] = mapped_column(default=True)  # Разрешить бронирование подарков

    # Статистика
    views_count: Mapped[int] = mapped_column(Integer, default=0)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="wishlists")
    items: Mapped[list["WishlistItem"]] = relationship(
        "WishlistItem",
        back_populates="wishlist",
        cascade="all, delete-orphan",
        order_by="WishlistItem.position"
    )

    def __repr__(self):
        return f"<Wishlist {self.id}: {self.title}>"

"""
Модель элемента списка желаний (WishlistItem)
"""
from datetime import UTC, datetime
from enum import Enum

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ItemPriority(str, Enum):
    """Приоритет желания"""
    low = "low"           # Низкий приоритет
    medium = "medium"     # Средний приоритет
    high = "high"         # Высокий приоритет


class ItemStatus(str, Enum):
    """Статус желания"""
    available = "available"   # Доступен для бронирования
    reserved = "reserved"     # Забронирован
    purchased = "purchased"   # Куплено


class MarketplaceType(str, Enum):
    """Популярные маркетплейсы"""
    wildberries = "wildberries"
    ozon = "ozon"
    yandex_market = "yandex_market"
    other = "other"


class WishlistItem(Base):
    """
    Элемент списка желаний (одно желание)

    Примеры:
    - Книга "Чистый код"
    - Наушники Sony WH-1000XM5
    - Абонемент в спортзал
    """
    __tablename__ = "wishlist_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Связь со списком желаний
    wishlist_id: Mapped[int] = mapped_column(Integer, ForeignKey("wishlists.id", ondelete="CASCADE"), nullable=False)

    # Основная информация
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Ссылка на товар
    link: Mapped[str] = mapped_column(String(1000), nullable=True)

    # Магазин/маркетплейс
    marketplace: Mapped[MarketplaceType] = mapped_column(
        SQLEnum(MarketplaceType),
        default=MarketplaceType.other,
        nullable=True
    )

    # Цена и валюта
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="RUB", nullable=True)

    # Приоритет и статус
    priority: Mapped[ItemPriority] = mapped_column(
        SQLEnum(ItemPriority),
        default=ItemPriority.medium,
        nullable=False
    )
    status: Mapped[ItemStatus] = mapped_column(
        SQLEnum(ItemStatus),
        default=ItemStatus.available,
        nullable=False
    )

    # Изображения
    image_url: Mapped[str] = mapped_column(String(1000), nullable=True)
    images: Mapped[list] = mapped_column(JSON, nullable=True)  # Список URL дополнительных картинок

    # Теги/категории (JSON массив)
    tags: Mapped[list] = mapped_column(JSON, nullable=True)

    # Позиция в списке (для сортировки)
    position: Mapped[int] = mapped_column(Integer, default=0)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    wishlist: Mapped["Wishlist"] = relationship("Wishlist", back_populates="items")
    reservations: Mapped[list["Reservation"]] = relationship(
        "Reservation",
        back_populates="item",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<WishlistItem {self.id}: {self.title}>"

"""
Pydantic схемы для элементов списка желаний
"""
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.item import ItemPriority, ItemStatus, MarketplaceType


class WishlistItemBase(BaseModel):
    """Базовая схема элемента"""
    title: str
    description: str | None = None
    link: str | None = None
    marketplace: MarketplaceType | None = MarketplaceType.other
    price: float | None = None
    currency: str | None = "RUB"
    priority: ItemPriority = ItemPriority.medium
    status: ItemStatus = ItemStatus.available
    image_url: str | None = None
    images: list[str] | None = []
    tags: list[str] | None = []


class WishlistItemCreate(WishlistItemBase):
    """Создание элемента"""
    wishlist_id: int
    position: int | None = 0


class WishlistItemUpdate(BaseModel):
    """Обновление элемента"""
    title: str | None = None
    description: str | None = None
    link: str | None = None
    marketplace: MarketplaceType | None = None
    price: float | None = None
    currency: str | None = None
    priority: ItemPriority | None = None
    status: ItemStatus | None = None
    image_url: str | None = None
    images: list[str] | None = None
    tags: list[str] | None = None
    position: int | None = None


class WishlistItem(WishlistItemBase):
    """Схема элемента (ответ API)"""
    id: int
    wishlist_id: int
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ParsedItemData(BaseModel):
    """Данные, распарсенные из URL товара"""
    title: str | None = None
    description: str | None = None
    price: float | None = None
    currency: str | None = "RUB"
    image_url: str | None = None
    images: list[str] | None = []
    marketplace: MarketplaceType | None = MarketplaceType.other
    success: bool = True
    error: str | None = None


class ReservationCreate(BaseModel):
    """Создание брони подарка"""
    item_id: int
    guest_name: str | None = None
    guest_email: str | None = None
    comment: str | None = None
    is_anonymous: bool = False


class Reservation(BaseModel):
    """Схема брони"""
    id: int
    item_id: int
    user_id: int | None = None
    guest_name: str | None = None
    guest_email: str | None = None
    comment: str | None = None
    is_anonymous: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

"""
Pydantic схемы для списков желаний
"""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.wishlist import WishlistAccessType


class WishlistBase(BaseModel):
    """Базовая схема вишлиста"""
    title: str
    description: str | None = None
    emoji: str | None = "🎁"
    event_date: date | None = None
    access_type: WishlistAccessType = WishlistAccessType.private
    theme_color: str | None = "#6366f1"
    cover_image_url: str | None = None
    allow_reservations: bool = True
    show_reservations_to_owner: bool = True


class WishlistCreate(WishlistBase):
    """Создание вишлиста"""
    slug: str | None = None  # Опционально - если не указан, генерируется автоматически


class WishlistUpdate(BaseModel):
    """Обновление вишлиста"""
    title: str | None = None
    description: str | None = None
    event_date: date | None = None
    access_type: WishlistAccessType | None = None
    theme_color: str | None = None
    cover_image_url: str | None = None
    allow_reservations: bool | None = None
    show_reservations_to_owner: bool | None = None


class Wishlist(WishlistBase):
    """Схема вишлиста (ответ API)"""
    id: int
    owner_id: int
    slug: str
    views_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WishlistDetail(Wishlist):
    """Детальная информация о вишлисте (с элементами)"""
    items: list["WishlistItem"] = []

    model_config = ConfigDict(from_attributes=True)


class WishlistStats(BaseModel):
    """Статистика по вишлисту"""
    total_items: int
    active_items: int
    purchased_items: int
    total_price: float
    reserved_items: int


# Для избежания циклических импортов
from app.schemas.item import WishlistItem  # noqa: E402

WishlistDetail.model_rebuild()

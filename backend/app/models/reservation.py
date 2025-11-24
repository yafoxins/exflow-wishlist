"""
Модель бронирования подарка
"""
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Reservation(Base):
    """
    Бронирование подарка гостем

    Когда кто-то заходит по ссылке на публичный список и говорит:
    "Я подарю это!" - создаётся запись о бронировании.

    Это помогает избежать дублирования подарков.
    """
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Связь с элементом списка
    item_id: Mapped[int] = mapped_column(Integer, ForeignKey("wishlist_items.id", ondelete="CASCADE"), nullable=False)

    # Кто забронировал (опционально - может быть незарегистрированный гость)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Имя гостя (если не авторизован)
    guest_name: Mapped[str] = mapped_column(String(255), nullable=True)

    # Email гостя (опционально)
    guest_email: Mapped[str] = mapped_column(String(255), nullable=True)

    # Комментарий от гостя
    comment: Mapped[str] = mapped_column(Text, nullable=True)

    # Анонимная бронь (скрыть от владельца списка)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    item: Mapped["WishlistItem"] = relationship("WishlistItem", back_populates="reservations")
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        reserver = self.user.full_name if self.user else self.guest_name
        return f"<Reservation {self.id}: {reserver} -> Item {self.item_id}>"

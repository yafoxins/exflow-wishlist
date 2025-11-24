"""
Модель OAuth аккаунтов (привязка внешних провайдеров)
"""
from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class OAuthAccount(Base):
    """
    Хранит информацию о привязанных OAuth аккаунтах

    Позволяет пользователю иметь несколько способов входа:
    - Яндекс ID
    - Telegram
    - Потенциально другие провайдеры (Google, VK и т.д.)
    """
    __tablename__ = "oauth_accounts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Связь с пользователем
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Провайдер OAuth (yandex, telegram, google и т.д.)
    provider: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # ID пользователя у провайдера
    provider_user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    # Access token (опционально, может храниться для API запросов)
    access_token: Mapped[str] = mapped_column(String(500), nullable=True)

    # Refresh token (опционально)
    refresh_token: Mapped[str] = mapped_column(String(500), nullable=True)

    # Срок действия токена
    token_expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Дополнительные данные от провайдера (JSON)
    provider_data: Mapped[dict] = mapped_column(JSON, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="oauth_accounts")

    def __repr__(self):
        return f"<OAuthAccount {self.provider}:{self.provider_user_id}>"

    class Config:
        # Уникальная комбинация провайдера и ID пользователя
        # (один пользователь не может привязать один и тот же аккаунт дважды)
        unique_together = [["provider", "provider_user_id"]]

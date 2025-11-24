"""
API v1 endpoints
"""
from fastapi import APIRouter

from app.api.v1 import auth, items, oauth, parser, reservations, telegram, wishlists

api_router = APIRouter()

# Подключаем роутеры
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(oauth.router, prefix="/oauth", tags=["oauth"], include_in_schema=False)  # Скрыто из docs
api_router.include_router(telegram.router, prefix="/telegram", tags=["telegram"], include_in_schema=False)  # Скрыто из docs
api_router.include_router(wishlists.router, prefix="/wishlists", tags=["wishlists"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
api_router.include_router(parser.router, prefix="/parser", tags=["parser"])

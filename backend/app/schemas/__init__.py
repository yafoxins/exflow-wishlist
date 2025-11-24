"""
Pydantic схемы для валидации данных API
"""
from app.schemas.auth import Token, TokenData, UserLogin, UserRegister
from app.schemas.item import ParsedItemData, WishlistItem, WishlistItemCreate, WishlistItemUpdate
from app.schemas.user import User, UserCreate, UserProfile, UserUpdate
from app.schemas.wishlist import Wishlist, WishlistCreate, WishlistDetail, WishlistUpdate

__all__ = [
    "Token",
    "TokenData",
    "UserLogin",
    "UserRegister",
    "User",
    "UserCreate",
    "UserUpdate",
    "UserProfile",
    "Wishlist",
    "WishlistCreate",
    "WishlistUpdate",
    "WishlistDetail",
    "WishlistItem",
    "WishlistItemCreate",
    "WishlistItemUpdate",
    "ParsedItemData"
]

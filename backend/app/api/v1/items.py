"""
Items API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.item import WishlistItem
from app.models.user import User
from app.models.wishlist import Wishlist
from app.schemas.item import WishlistItem as ItemSchema
from app.schemas.item import WishlistItemCreate, WishlistItemUpdate

router = APIRouter()


@router.post("/", response_model=ItemSchema, status_code=201)
async def create_item(
    data: WishlistItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создание нового элемента"""
    # Проверяем права на список
    result = await db.execute(
        select(Wishlist).where(
            Wishlist.id == data.wishlist_id,
            Wishlist.owner_id == current_user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    item = WishlistItem(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ItemSchema)
async def update_item(
    item_id: int,
    data: WishlistItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновление элемента"""
    result = await db.execute(select(WishlistItem).where(WishlistItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Элемент не найден")

    # Проверяем права
    wishlist_result = await db.execute(
        select(Wishlist).where(
            Wishlist.id == item.wishlist_id,
            Wishlist.owner_id == current_user.id
        )
    )
    if not wishlist_result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)

    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удаление элемента"""
    result = await db.execute(select(WishlistItem).where(WishlistItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Элемент не найден")

    # Проверяем права
    wishlist_result = await db.execute(
        select(Wishlist).where(
            Wishlist.id == item.wishlist_id,
            Wishlist.owner_id == current_user.id
        )
    )
    if not wishlist_result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    await db.delete(item)
    await db.commit()

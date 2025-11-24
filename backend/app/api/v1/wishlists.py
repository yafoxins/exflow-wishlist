"""
Wishlists API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_optional_current_user
from app.core.utils import generate_slug
from app.database import get_db
from app.models.user import User
from app.models.wishlist import Wishlist, WishlistAccessType
from app.schemas.wishlist import Wishlist as WishlistSchema
from app.schemas.wishlist import WishlistCreate, WishlistDetail, WishlistUpdate

router = APIRouter()


@router.get("/", response_model=list[WishlistSchema])
async def get_my_wishlists(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение списков текущего пользователя"""
    result = await db.execute(
        select(Wishlist).where(Wishlist.owner_id == current_user.id)
    )
    return result.scalars().all()


@router.post("/", response_model=WishlistSchema, status_code=201)
async def create_wishlist(
    data: WishlistCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создание нового списка"""
    # Генерируем slug
    slug = data.slug or generate_slug(data.title)

    # Проверяем уникальность
    result = await db.execute(select(Wishlist).where(Wishlist.slug == slug))
    if result.scalar_one_or_none():
        slug = f"{slug}-{current_user.id}"

    wishlist = Wishlist(
        **data.model_dump(exclude={"slug"}),
        slug=slug,
        owner_id=current_user.id
    )
    db.add(wishlist)
    await db.commit()
    await db.refresh(wishlist)
    return wishlist


@router.get("/u/{username}/{wishlist_id}", response_model=WishlistDetail)
async def get_wishlist_by_username(
    username: str,
    wishlist_id: int,
    current_user: User | None = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение списка по username и ID (публичная ссылка)"""
    # Находим пользователя по username
    result = await db.execute(
        select(User).where(User.username == username)
    )
    owner = result.scalar_one_or_none()
    if not owner:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Находим вишлист
    result = await db.execute(
        select(Wishlist)
        .options(selectinload(Wishlist.items))
        .where(Wishlist.id == wishlist_id, Wishlist.owner_id == owner.id)
    )
    wishlist = result.scalar_one_or_none()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Список не найден")

    # Проверка прав доступа
    is_owner = current_user and wishlist.owner_id == current_user.id
    is_public = wishlist.access_type == WishlistAccessType.public
    is_by_link = wishlist.access_type == WishlistAccessType.by_link

    # Владелец всегда имеет доступ
    # Публичные списки доступны всем
    # Списки "по ссылке" доступны всем, кто знает ссылку
    # Приватные списки - только владельцу
    if not (is_owner or is_public or is_by_link):
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    return wishlist


@router.get("/{wishlist_id}", response_model=WishlistDetail)
async def get_wishlist(
    wishlist_id: int,
    current_user: User | None = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение списка по ID (публичный доступ для public/by_link)"""
    result = await db.execute(
        select(Wishlist)
        .options(selectinload(Wishlist.items))
        .where(Wishlist.id == wishlist_id)
    )
    wishlist = result.scalar_one_or_none()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Список не найден")

    # Проверка прав доступа
    is_owner = current_user and wishlist.owner_id == current_user.id
    is_public = wishlist.access_type == WishlistAccessType.public
    is_by_link = wishlist.access_type == WishlistAccessType.by_link

    # Владелец всегда имеет доступ
    # Публичные списки доступны всем
    # Списки "по ссылке" доступны всем, кто знает ID
    # Приватные списки - только владельцу
    if not (is_owner or is_public or is_by_link):
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    return wishlist


@router.put("/{wishlist_id}", response_model=WishlistSchema)
async def update_wishlist(
    wishlist_id: int,
    data: WishlistUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновление списка"""
    result = await db.execute(
        select(Wishlist).where(
            Wishlist.id == wishlist_id,
            Wishlist.owner_id == current_user.id
        )
    )
    wishlist = result.scalar_one_or_none()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Список не найден")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(wishlist, key, value)

    await db.commit()
    await db.refresh(wishlist)
    return wishlist


@router.delete("/{wishlist_id}", status_code=204)
async def delete_wishlist(
    wishlist_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удаление списка"""
    result = await db.execute(
        select(Wishlist).where(
            Wishlist.id == wishlist_id,
            Wishlist.owner_id == current_user.id
        )
    )
    wishlist = result.scalar_one_or_none()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Список не найден")

    await db.delete(wishlist)
    await db.commit()

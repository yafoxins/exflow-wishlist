"""
Reservations API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.item import WishlistItem
from app.models.reservation import Reservation
from app.models.user import User
from app.models.wishlist import Wishlist
from app.schemas.item import Reservation as ReservationSchema
from app.schemas.item import ReservationCreate

router = APIRouter()


@router.post("/", response_model=ReservationSchema, status_code=201)
async def create_reservation(
    data: ReservationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создание бронирования подарка"""
    # Получаем item
    result = await db.execute(
        select(WishlistItem).where(WishlistItem.id == data.item_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Подарок не найден")

    # Проверяем, что item еще не забронирован
    if item.status != 'available':
        raise HTTPException(status_code=400, detail="Подарок уже забронирован")

    # Получаем wishlist для проверки прав
    wishlist_result = await db.execute(
        select(Wishlist).where(Wishlist.id == item.wishlist_id)
    )
    wishlist = wishlist_result.scalar_one_or_none()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Список не найден")

    # Владелец не может бронировать свои же подарки
    if wishlist.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя бронировать свои подарки")

    # Проверяем, разрешены ли бронирования
    if not wishlist.allow_reservations:
        raise HTTPException(status_code=400, detail="Бронирование отключено для этого списка")

    # Проверяем доступ к wishlist
    is_public = wishlist.access_type == 'public'
    is_by_link = wishlist.access_type == 'by_link'
    if not (is_public or is_by_link):
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    # Создаем бронирование
    reservation = Reservation(
        item_id=data.item_id,
        user_id=current_user.id,
        guest_name=data.guest_name,
        guest_email=data.guest_email,
        comment=data.comment,
        is_anonymous=data.is_anonymous
    )
    db.add(reservation)

    # Обновляем статус item
    item.status = 'reserved'

    await db.commit()
    await db.refresh(reservation)
    return reservation


@router.delete("/{reservation_id}", status_code=204)
async def cancel_reservation(
    reservation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Отмена бронирования"""
    result = await db.execute(
        select(Reservation).where(Reservation.id == reservation_id)
    )
    reservation = result.scalar_one_or_none()
    if not reservation:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    # Только создатель бронирования может его отменить
    if reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    # Получаем item и обновляем статус
    item_result = await db.execute(
        select(WishlistItem).where(WishlistItem.id == reservation.item_id)
    )
    item = item_result.scalar_one_or_none()
    if item:
        item.status = 'available'

    await db.delete(reservation)
    await db.commit()


@router.patch("/{reservation_id}", response_model=ReservationSchema)
async def update_reservation(
    reservation_id: int,
    data: ReservationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновление бронирования"""
    result = await db.execute(
        select(Reservation).where(Reservation.id == reservation_id)
    )
    reservation = result.scalar_one_or_none()
    if not reservation:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    # Только создатель бронирования может его обновить
    if reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    # Обновляем только разрешенные поля
    if data.guest_name is not None:
        reservation.guest_name = data.guest_name
    if data.guest_email is not None:
        reservation.guest_email = data.guest_email
    if data.comment is not None:
        reservation.comment = data.comment
    reservation.is_anonymous = data.is_anonymous

    await db.commit()
    await db.refresh(reservation)
    return reservation

"""
Тесты для работы со списками желаний
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, get_password_hash
from app.models.user import User
from app.models.wishlist import Wishlist


async def create_test_user(db_session: AsyncSession) -> tuple[User, str]:
    """Вспомогательная функция для создания тестового пользователя"""
    user = User(
        email="wishlist@example.com",
        username="wishlistuser",
        hashed_password=get_password_hash("password123")
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    token = create_access_token({"user_id": user.id})
    return user, token


@pytest.mark.asyncio
async def test_create_wishlist(client: AsyncClient, db_session: AsyncSession):
    """Тест создания нового списка желаний"""
    user, token = await create_test_user(db_session)

    response = await client.post(
        "/api/v1/wishlists/",
        json={
            "title": "Мой День Рождения 2025",
            "description": "Что я хочу на ДР",
            "access_type": "private"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Мой День Рождения 2025"
    assert data["owner_id"] == user.id
    assert "slug" in data


@pytest.mark.asyncio
async def test_get_my_wishlists(client: AsyncClient, db_session: AsyncSession):
    """Тест получения списка своих вишлистов"""
    user, token = await create_test_user(db_session)

    # Создаём несколько списков
    for i in range(3):
        wishlist = Wishlist(
            title=f"Список {i+1}",
            slug=f"spisok-{i+1}",
            owner_id=user.id
        )
        db_session.add(wishlist)
    await db_session.commit()

    # Получаем списки
    response = await client.get(
        "/api/v1/wishlists/",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert all(item["owner_id"] == user.id for item in data)


@pytest.mark.asyncio
async def test_update_wishlist(client: AsyncClient, db_session: AsyncSession):
    """Тест обновления списка желаний"""
    user, token = await create_test_user(db_session)

    wishlist = Wishlist(
        title="Старое название",
        slug="old-title",
        owner_id=user.id
    )
    db_session.add(wishlist)
    await db_session.commit()
    await db_session.refresh(wishlist)

    response = await client.put(
        f"/api/v1/wishlists/{wishlist.id}",
        json={
            "title": "Новое название",
            "description": "Обновлённое описание"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Новое название"
    assert data["description"] == "Обновлённое описание"


@pytest.mark.asyncio
async def test_delete_wishlist(client: AsyncClient, db_session: AsyncSession):
    """Тест удаления списка желаний"""
    user, token = await create_test_user(db_session)

    wishlist = Wishlist(
        title="Список для удаления",
        slug="delete-me",
        owner_id=user.id
    )
    db_session.add(wishlist)
    await db_session.commit()
    await db_session.refresh(wishlist)

    response = await client.delete(
        f"/api/v1/wishlists/{wishlist.id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 204


@pytest.mark.asyncio
async def test_cannot_update_others_wishlist(client: AsyncClient, db_session: AsyncSession):
    """Тест: нельзя обновить чужой список"""
    # Создаём первого пользователя и его список
    user1 = User(
        email="user1@example.com",
        username="user1",
        hashed_password=get_password_hash("pass1")
    )
    db_session.add(user1)
    await db_session.commit()
    await db_session.refresh(user1)

    wishlist = Wishlist(
        title="Список user1",
        slug="user1-list",
        owner_id=user1.id
    )
    db_session.add(wishlist)
    await db_session.commit()
    await db_session.refresh(wishlist)

    # Создаём второго пользователя
    user2 = User(
        email="user2@example.com",
        username="user2",
        hashed_password=get_password_hash("pass2")
    )
    db_session.add(user2)
    await db_session.commit()
    await db_session.refresh(user2)

    token2 = create_access_token({"user_id": user2.id})

    # Пытаемся обновить чужой список
    response = await client.put(
        f"/api/v1/wishlists/{wishlist.id}",
        json={"title": "Взлом!"},
        headers={"Authorization": f"Bearer {token2}"}
    )

    assert response.status_code == 404  # Или 403

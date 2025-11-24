"""
Тесты для аутентификации и регистрации
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.user import User


@pytest.mark.asyncio
async def test_register_new_user(client: AsyncClient):
    """Тест регистрации нового пользователя"""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "strongpassword123"
        }
    )

    assert response.status_code == 201
    data = response.json()

    # Проверяем, что вернулись токены
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient, db_session: AsyncSession):
    """Тест регистрации с уже существующим email"""
    # Создаём пользователя
    user = User(
        email="existing@example.com",
        username="existing",
        hashed_password=get_password_hash("password123")
    )
    db_session.add(user)
    await db_session.commit()

    # Пытаемся зарегистрировать с тем же email
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "existing@example.com",
            "username": "newuser",
            "full_name": "New User",
            "password": "password456"
        }
    )

    assert response.status_code == 400
    assert "уже зарегистрирован" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, db_session: AsyncSession):
    """Тест успешного входа"""
    # Создаём пользователя
    user = User(
        email="login@example.com",
        username="loginuser",
        hashed_password=get_password_hash("mypassword123")
    )
    db_session.add(user)
    await db_session.commit()

    # Пытаемся войти
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "mypassword123"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, db_session: AsyncSession):
    """Тест входа с неверным паролем"""
    user = User(
        email="user@example.com",
        username="user",
        hashed_password=get_password_hash("correctpassword")
    )
    db_session.add(user)
    await db_session.commit()

    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "user@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401
    assert "неверный" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, db_session: AsyncSession):
    """Тест получения данных текущего пользователя"""
    # Регистрируем пользователя
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "me@example.com",
            "username": "me",
            "full_name": "Me User",
            "password": "password123"
        }
    )
    access_token = response.json()["access_token"]

    # Получаем информацию о себе
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"
    assert data["username"] == "me"
    assert data["full_name"] == "Me User"

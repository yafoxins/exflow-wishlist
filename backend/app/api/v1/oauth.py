"""
OAuth API endpoints для Telegram и Яндекс ID
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime
import httpx
import hashlib
import hmac
import json
from urllib.parse import parse_qs
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.models.oauth import OAuthAccount
from app.schemas.auth import Token
from app.core.security import create_access_token, create_refresh_token
from app.config import settings

router = APIRouter()


class TelegramWebAppAuth(BaseModel):
    """Модель для авторизации через Telegram WebApp"""
    initData: str


class TelegramAuthResponse(BaseModel):
    """Ответ с токенами авторизации"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


@router.get("/telegram")
async def telegram_auth(
    id: int,
    first_name: str,
    username: str = None,
    photo_url: str = None,
    auth_date: int = None,
    hash: str = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Авторизация через Telegram Login Widget

    Проверяет подпись данных от Telegram и создает/обновляет пользователя
    """
    # Проверка подписи Telegram
    if not verify_telegram_auth(id, first_name, username, photo_url, auth_date, hash):
        raise HTTPException(status_code=400, detail="Неверная подпись Telegram")

    # Ищем OAuth аккаунт
    result = await db.execute(
        select(OAuthAccount)
        .options(selectinload(OAuthAccount.user))
        .where(
            OAuthAccount.provider == "telegram",
            OAuthAccount.provider_user_id == str(id)
        )
    )
    oauth_account = result.scalar_one_or_none()

    if oauth_account:
        # Пользователь уже существует
        user = oauth_account.user

        # Обновляем данные
        oauth_account.provider_data = {
            "first_name": first_name,
            "username": username,
            "photo_url": photo_url
        }
        oauth_account.updated_at = datetime.utcnow()
    else:
        # Создаем нового пользователя
        user = User(
            username=username or f"tg_{id}",
            full_name=first_name,
            email=f"tg_{id}@telegram.user",  # Telegram не предоставляет email
            is_verified=False
        )
        db.add(user)
        await db.flush()

        # Создаем OAuth аккаунт
        oauth_account = OAuthAccount(
            user_id=user.id,
            provider="telegram",
            provider_user_id=str(id),
            provider_data={
                "first_name": first_name,
                "username": username,
                "photo_url": photo_url
            }
        )
        db.add(oauth_account)

    # Обновляем last_login
    user.last_login = datetime.utcnow()
    await db.commit()

    # Генерация токенов
    access_token = create_access_token({"user_id": user.id})
    refresh_token = create_refresh_token({"user_id": user.id})

    # Редирект на frontend с токенами
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?access_token={access_token}&refresh_token={refresh_token}"
    )


@router.get("/yandex")
async def yandex_auth():
    """Перенаправление на Яндекс OAuth"""
    auth_url = (
        f"https://oauth.yandex.ru/authorize?"
        f"response_type=code&"
        f"client_id={settings.YANDEX_CLIENT_ID}&"
        f"redirect_uri={settings.BACKEND_URL}/api/v1/oauth/yandex/callback"
    )
    return RedirectResponse(url=auth_url)


@router.get("/yandex/callback")
async def yandex_callback(
    code: str,
    db: AsyncSession = Depends(get_db)
):
    """Callback от Яндекс OAuth"""
    # Обмен кода на токен
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth.yandex.ru/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": settings.YANDEX_CLIENT_ID,
                "client_secret": settings.YANDEX_CLIENT_SECRET
            }
        )

        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Ошибка получения токена от Яндекс")

        token_data = token_response.json()
        access_token_yandex = token_data["access_token"]

        # Получение информации о пользователе
        user_response = await client.get(
            "https://login.yandex.ru/info",
            headers={"Authorization": f"OAuth {access_token_yandex}"}
        )

        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Ошибка получения данных пользователя")

        user_data = user_response.json()

    # Ищем OAuth аккаунт
    yandex_id = user_data["id"]
    result = await db.execute(
        select(OAuthAccount)
        .options(selectinload(OAuthAccount.user))
        .where(
            OAuthAccount.provider == "yandex",
            OAuthAccount.provider_user_id == yandex_id
        )
    )
    oauth_account = result.scalar_one_or_none()

    if oauth_account:
        # Пользователь уже существует
        user = oauth_account.user

        # Обновляем профиль пользователя из Yandex
        if user_data.get("default_avatar_id") and not user.avatar_url:
            user.avatar_url = f"https://avatars.yandex.net/get-yapic/{user_data['default_avatar_id']}/islands-200"
        if user_data.get("real_name") and not user.full_name:
            user.full_name = user_data.get("real_name") or user_data.get("display_name")

        # Обновляем токен
        oauth_account.access_token = access_token_yandex
        oauth_account.provider_data = user_data
        oauth_account.updated_at = datetime.utcnow()
    else:
        # Проверяем, есть ли пользователь с таким email
        email = user_data.get("default_email") or user_data.get("emails", [None])[0]

        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user:
            # Привязываем OAuth к существующему пользователю
            oauth_account = OAuthAccount(
                user_id=user.id,
                provider="yandex",
                provider_user_id=yandex_id,
                access_token=access_token_yandex,
                provider_data=user_data
            )
            db.add(oauth_account)
        else:
            # Создаем нового пользователя
            # Получаем аватар из Yandex
            avatar_url = None
            if user_data.get("default_avatar_id"):
                avatar_url = f"https://avatars.yandex.net/get-yapic/{user_data['default_avatar_id']}/islands-200"

            user = User(
                username=user_data.get("login"),
                full_name=user_data.get("real_name") or user_data.get("display_name"),
                email=email,
                avatar_url=avatar_url,
                is_verified=True  # Яндекс уже проверил email
            )
            db.add(user)
            await db.flush()

            # Создаем OAuth аккаунт
            oauth_account = OAuthAccount(
                user_id=user.id,
                provider="yandex",
                provider_user_id=yandex_id,
                access_token=access_token_yandex,
                provider_data=user_data
            )
            db.add(oauth_account)

    # Обновляем last_login
    user.last_login = datetime.utcnow()
    await db.commit()

    # Генерация токенов
    access_token = create_access_token({"user_id": user.id})
    refresh_token = create_refresh_token({"user_id": user.id})

    # Редирект на frontend с токенами
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?access_token={access_token}&refresh_token={refresh_token}"
    )


def verify_telegram_auth(
    id: int,
    first_name: str,
    username: str,
    photo_url: str,
    auth_date: int,
    hash: str
) -> bool:
    """
    Проверка подписи данных от Telegram Login Widget
    https://core.telegram.org/widgets/login#checking-authorization
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        return False

    # Создаем data-check-string
    check_data = []
    if auth_date:
        check_data.append(f"auth_date={auth_date}")
    if first_name:
        check_data.append(f"first_name={first_name}")
    if id:
        check_data.append(f"id={id}")
    if photo_url:
        check_data.append(f"photo_url={photo_url}")
    if username:
        check_data.append(f"username={username}")

    check_string = "\n".join(sorted(check_data))

    # Вычисляем secret_key
    secret_key = hashlib.sha256(settings.TELEGRAM_BOT_TOKEN.encode()).digest()

    # Вычисляем hash
    calculated_hash = hmac.new(
        secret_key,
        check_string.encode(),
        hashlib.sha256
    ).hexdigest()

    return calculated_hash == hash


def verify_telegram_webapp_init_data(init_data: str) -> dict | None:
    """
    Проверка подписи initData от Telegram WebApp
    https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app

    Returns:
        dict с данными пользователя или None если подпись неверна
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        return None

    try:
        # Парсим initData (формат: key=value&key2=value2...)
        parsed = parse_qs(init_data)

        # Извлекаем hash
        hash_value = parsed.get('hash', [None])[0]
        if not hash_value:
            return None

        # Создаем data-check-string (все параметры кроме hash, отсортированные)
        data_check_arr = []
        for key in sorted(parsed.keys()):
            if key != 'hash':
                values = parsed[key]
                for value in values:
                    data_check_arr.append(f"{key}={value}")

        data_check_string = '\n'.join(data_check_arr)

        # Вычисляем secret_key
        secret_key = hmac.new(
            "WebAppData".encode(),
            settings.TELEGRAM_BOT_TOKEN.encode(),
            hashlib.sha256
        ).digest()

        # Вычисляем hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()

        # Проверяем подпись
        if calculated_hash != hash_value:
            return None

        # Парсим данные пользователя
        user_json = parsed.get('user', [None])[0]
        if not user_json:
            return None

        user_data = json.loads(user_json)
        return user_data

    except Exception as e:
        print(f"Ошибка проверки Telegram WebApp initData: {e}")
        return None


@router.post("/telegram/webapp", response_model=TelegramAuthResponse)
async def telegram_webapp_auth(
    auth_data: TelegramWebAppAuth,
    db: AsyncSession = Depends(get_db)
):
    """
    Авторизация через Telegram WebApp

    Принимает initData от Telegram WebApp, проверяет подпись
    и создает/обновляет пользователя
    """
    # Проверка подписи и извлечение данных пользователя
    user_data = verify_telegram_webapp_init_data(auth_data.initData)

    if not user_data:
        raise HTTPException(status_code=400, detail="Неверная подпись Telegram WebApp")

    telegram_id = user_data.get('id')
    first_name = user_data.get('first_name', '')
    last_name = user_data.get('last_name', '')
    username = user_data.get('username')
    photo_url = user_data.get('photo_url')

    if not telegram_id:
        raise HTTPException(status_code=400, detail="Отсутствует Telegram ID")

    # Ищем OAuth аккаунт
    result = await db.execute(
        select(OAuthAccount)
        .options(selectinload(OAuthAccount.user))
        .where(
            OAuthAccount.provider == "telegram",
            OAuthAccount.provider_user_id == str(telegram_id)
        )
    )
    oauth_account = result.scalar_one_or_none()

    full_name = f"{first_name} {last_name}".strip() or first_name

    if oauth_account:
        # Пользователь уже существует
        user = oauth_account.user

        # Обновляем данные
        oauth_account.provider_data = {
            "first_name": first_name,
            "last_name": last_name,
            "username": username,
            "photo_url": photo_url
        }
        oauth_account.updated_at = datetime.utcnow()

        # Обновляем имя пользователя если изменилось
        if full_name and user.full_name != full_name:
            user.full_name = full_name
    else:
        # Создаем нового пользователя
        user = User(
            username=username or f"tg_{telegram_id}",
            full_name=full_name,
            email=f"tg_{telegram_id}@telegram.user",  # Telegram не предоставляет email
            telegram_id=telegram_id,
            telegram_username=username,
            avatar_url=photo_url,
            is_verified=True  # Telegram уже проверил пользователя
        )
        db.add(user)
        await db.flush()

        # Создаем OAuth аккаунт
        oauth_account = OAuthAccount(
            user_id=user.id,
            provider="telegram",
            provider_user_id=str(telegram_id),
            provider_data={
                "first_name": first_name,
                "last_name": last_name,
                "username": username,
                "photo_url": photo_url
            }
        )
        db.add(oauth_account)

    # Обновляем last_login
    user.last_login = datetime.utcnow()
    await db.commit()

    # Генерация токенов
    access_token = create_access_token({"user_id": user.id})
    refresh_token = create_refresh_token({"user_id": user.id})

    return TelegramAuthResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )

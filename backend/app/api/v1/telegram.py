"""
Telegram Bot Webhook API
"""
from fastapi import APIRouter, Request, HTTPException
from telegram import Update
from app.services.telegram_bot import wishlist_bot
import json

router = APIRouter()


@router.post("/webhook")
async def telegram_webhook(request: Request):
    """
    Webhook endpoint для получения обновлений от Telegram бота

    Telegram будет отправлять сюда все обновления (сообщения, команды и т.д.)
    """
    try:
        # Получаем данные от Telegram
        data = await request.json()

        # Создаем объект Update
        update = Update.de_json(data, wishlist_bot.app.bot)

        # Обрабатываем update через application
        if wishlist_bot.app:
            await wishlist_bot.app.process_update(update)

        return {"ok": True}

    except Exception as e:
        print(f"Ошибка обработки webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/webhook/info")
async def webhook_info():
    """Получить информацию о webhook"""
    if not wishlist_bot.app:
        return {"error": "Бот не инициализирован"}

    try:
        webhook_info = await wishlist_bot.app.bot.get_webhook_info()
        return {
            "url": webhook_info.url,
            "has_custom_certificate": webhook_info.has_custom_certificate,
            "pending_update_count": webhook_info.pending_update_count,
            "last_error_date": webhook_info.last_error_date,
            "last_error_message": webhook_info.last_error_message,
        }
    except Exception as e:
        return {"error": str(e)}


@router.post("/webhook/set")
async def set_webhook():
    """Установить webhook для бота"""
    if not wishlist_bot.app:
        raise HTTPException(status_code=500, detail="Бот не инициализирован")

    try:
        from app.config import settings
        webhook_url = settings.TELEGRAM_WEBHOOK_URL

        await wishlist_bot.app.bot.set_webhook(url=webhook_url)

        return {
            "ok": True,
            "message": f"Webhook установлен на {webhook_url}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook/delete")
async def delete_webhook():
    """Удалить webhook (для разработки)"""
    if not wishlist_bot.app:
        raise HTTPException(status_code=500, detail="Бот не инициализирован")

    try:
        await wishlist_bot.app.bot.delete_webhook()
        return {"ok": True, "message": "Webhook удален"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

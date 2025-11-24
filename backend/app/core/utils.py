"""
Вспомогательные функции
"""
import secrets

from slugify import slugify


def generate_slug(text: str, max_length: int = 100) -> str:
    """
    Генерация slug из текста

    Args:
        text: Исходный текст (например, название вишлиста)
        max_length: Максимальная длина slug

    Returns:
        Slug в латинице
    """
    slug = slugify(text, max_length=max_length)

    # Если текст на кириллице и slug пустой, генерируем случайный
    if not slug:
        slug = f"wishlist-{secrets.token_urlsafe(8)}"

    return slug


def generate_unique_slug(base_slug: str, existing_slugs: list) -> str:
    """
    Генерация уникального slug (добавляет суффикс если slug уже существует)

    Args:
        base_slug: Базовый slug
        existing_slugs: Список существующих slugs

    Returns:
        Уникальный slug
    """
    slug = base_slug
    counter = 1

    while slug in existing_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


def format_price(price: float | None, currency: str = "RUB") -> str:
    """
    Форматирование цены

    Args:
        price: Цена
        currency: Валюта

    Returns:
        Отформатированная строка (например, "1 499 ₽")
    """
    if price is None:
        return "Цена не указана"

    currency_symbols = {
        "RUB": "₽",
        "USD": "$",
        "EUR": "€"
    }

    symbol = currency_symbols.get(currency, currency)

    # Форматируем с пробелами между тысячами
    formatted = f"{price:,.0f}".replace(",", " ")

    return f"{formatted} {symbol}"


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Обрезка текста до максимальной длины

    Args:
        text: Исходный текст
        max_length: Максимальная длина
        suffix: Суффикс (обычно "...")

    Returns:
        Обрезанный текст
    """
    if len(text) <= max_length:
        return text

    return text[:max_length - len(suffix)] + suffix

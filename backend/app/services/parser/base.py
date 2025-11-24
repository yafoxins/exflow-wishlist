"""
Базовый класс для парсеров товаров

Каждый парсер должен наследоваться от BaseParser и реализовать:
- can_parse(url) - проверка, может ли парсер обработать эту ссылку
- parse(url) - непосредственно парсинг данных
"""
from abc import ABC, abstractmethod

import httpx

from app.schemas.item import ParsedItemData


class BaseParser(ABC):
    """
    Базовый класс для парсера товаров

    Каждый конкретный парсер (Wildberries, Ozon и т.д.)
    должен наследоваться от этого класса.
    """

    def __init__(self):
        self.timeout = 10  # Таймаут для HTTP запросов

    @abstractmethod
    def can_parse(self, url: str) -> bool:
        """
        Проверка, может ли парсер обработать данную ссылку

        Args:
            url: URL товара

        Returns:
            True если парсер может обработать ссылку
        """
        pass

    @abstractmethod
    async def parse(self, url: str) -> ParsedItemData:
        """
        Парсинг данных товара

        Args:
            url: URL товара

        Returns:
            Распарсенные данные товара
        """
        pass

    async def fetch_html(self, url: str) -> str | None:
        """
        Загрузка HTML страницы

        Args:
            url: URL страницы

        Returns:
            HTML код страницы или None при ошибке
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                return response.text
        except Exception as e:
            print(f"Ошибка при загрузке {url}: {e}")
            return None

    def extract_price(self, text: str) -> float | None:
        """
        Извлечение цены из текста

        Args:
            text: Текст с ценой (например, "1 499 ₽")

        Returns:
            Цена в виде числа или None
        """
        import re

        # Удаляем все кроме цифр и точки/запятой
        cleaned = re.sub(r'[^\d.,]', '', text)

        # Заменяем запятую на точку
        cleaned = cleaned.replace(',', '.')

        try:
            return float(cleaned)
        except ValueError:
            return None

"""
Парсер товаров Wildberries

Использует публичное API Wildberries для получения данных о товарах.
"""
import re
import json

from app.models.item import MarketplaceType
from app.schemas.item import ParsedItemData
from app.services.parser.base import BaseParser


class WildberriesParser(BaseParser):
    """
    Парсер товаров с Wildberries

    Использует публичное API Wildberries.

    Поддерживаемые форматы URL:
    - https://www.wildberries.ru/catalog/123456789/detail.aspx
    - https://www.wb.ru/catalog/123456789/detail.aspx
    """

    def can_parse(self, url: str) -> bool:
        """Проверка, является ли ссылка ссылкой на Wildberries"""
        return "wildberries.ru" in url or "wb.ru" in url

    async def parse(self, url: str) -> ParsedItemData:
        """
        Парсинг товара с Wildberries через публичное API
        """
        try:
            # Извлекаем артикул из URL
            article = self._extract_article(url)

            if not article:
                return ParsedItemData(
                    success=False,
                    error="Не удалось извлечь артикул товара из ссылки"
                )

            # Используем публичное API Wildberries
            data = await self._fetch_from_api(article)

            if not data:
                return ParsedItemData(
                    success=False,
                    error=f"Товар с артикулом {article} не найден на Wildberries. Возможно, товар снят с продажи или ссылка неверна."
                )

            # Извлекаем данные
            title = data.get('name')
            price = data.get('salePriceU', 0) / 100  # Цена в копейках
            brand = data.get('brand')

            # Формируем полное название
            if brand and title:
                title = f"{brand} / {title}"

            # Генерируем URL изображений
            images = self._generate_image_urls(article)

            return ParsedItemData(
                title=title,
                price=price if price > 0 else None,
                currency="RUB",
                image_url=images[0] if images else None,
                images=images,
                marketplace=MarketplaceType.wildberries,
                success=True
            )

        except Exception as e:
            return ParsedItemData(
                success=False,
                error=f"Ошибка парсинга: {str(e)}"
            )

    async def _fetch_from_api(self, article: str) -> dict | None:
        """
        Получение данных через публичное API Wildberries

        API возвращает данные в формате JSON
        """
        try:
            import httpx

            # Определяем корзину (basket) для товара
            vol = int(article) // 100000
            part = int(article) // 1000

            # URL к публичному API Wildberries v2
            api_url = f"https://card.wb.ru/cards/v2/detail?nm={article}"

            async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
                response = await client.get(api_url, headers=headers)
                response.raise_for_status()

                result = response.json()

                # Извлекаем данные товара
                if 'data' in result and 'products' in result['data']:
                    products = result['data']['products']
                    if products and len(products) > 0:
                        return products[0]

                return None

        except Exception as e:
            print(f"Ошибка при запросе к API Wildberries: {e}")
            return None

    def _extract_article(self, url: str) -> str | None:
        """Извлечение артикула товара из URL"""
        match = re.search(r'/catalog/(\d+)/', url)
        if match:
            return match.group(1)
        return None

    def _generate_image_urls(self, article: str) -> list:
        """
        Генерация URL изображений по схеме Wildberries

        Wildberries хранит изображения по схеме:
        https://basket-{XX}.wb.ru/vol{vol}/part{part}/{article}/images/big/1.jpg
        """
        images = []

        try:
            article_int = int(article)

            # Определяем vol и part
            vol = article_int // 100000
            part = article_int // 1000

            # Определяем номер корзины (basket)
            if vol >= 0 and vol <= 143:
                basket = "01"
            elif vol >= 144 and vol <= 287:
                basket = "02"
            elif vol >= 288 and vol <= 431:
                basket = "03"
            elif vol >= 432 and vol <= 719:
                basket = "04"
            elif vol >= 720 and vol <= 1007:
                basket = "05"
            elif vol >= 1008 and vol <= 1061:
                basket = "06"
            elif vol >= 1062 and vol <= 1115:
                basket = "07"
            elif vol >= 1116 and vol <= 1169:
                basket = "08"
            elif vol >= 1170 and vol <= 1313:
                basket = "09"
            elif vol >= 1314 and vol <= 1601:
                basket = "10"
            elif vol >= 1602 and vol <= 1655:
                basket = "11"
            elif vol >= 1656 and vol <= 1919:
                basket = "12"
            elif vol >= 1920 and vol <= 2045:
                basket = "13"
            elif vol >= 2046 and vol <= 2189:
                basket = "14"
            else:
                basket = "15"

            base_url = f"https://basket-{basket}.wbbasket.ru/vol{vol}/part{part}/{article}/images/big/"

            # Генерируем URL для первых 5 изображений
            for i in range(1, 6):
                images.append(f"{base_url}{i}.webp")

        except Exception as e:
            print(f"Ошибка генерации URL изображений: {e}")

        return images

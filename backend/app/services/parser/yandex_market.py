"""
Парсер товаров Яндекс.Маркет

ВАЖНО: Это базовая реализация через парсинг HTML.
В продакшене рекомендуется использовать Yandex Market API,
если у вас есть партнёрский доступ.

Места для доработки отмечены комментариями TODO: OFFICIAL API
"""
import json
import re

from bs4 import BeautifulSoup

from app.models.item import MarketplaceType
from app.schemas.item import ParsedItemData
from app.services.parser.base import BaseParser


class YandexMarketParser(BaseParser):
    """
    Парсер товаров с Яндекс.Маркет

    Поддерживаемые форматы URL:
    - https://market.yandex.ru/product/123456789
    - https://ya.ru/product/123456789 (короткая ссылка)
    """

    def can_parse(self, url: str) -> bool:
        """Проверка, является ли ссылка ссылкой на Яндекс.Маркет"""
        return ("market.yandex.ru" in url or "m.market.yandex.ru" in url) and "/product/" in url

    async def parse(self, url: str) -> ParsedItemData:
        """
        Парсинг товара с Яндекс.Маркет

        TODO: OFFICIAL API - замените на вызов официального API
        if settings.YANDEX_MARKET_API_KEY:
            return await self._parse_via_api(product_id)
        """
        try:
            # Извлекаем ID товара из URL
            product_id = self._extract_product_id(url)

            if not product_id:
                return ParsedItemData(
                    success=False,
                    error="Не удалось извлечь ID товара из ссылки"
                )

            # TODO: OFFICIAL API - здесь можно вызвать официальный API
            # if settings.YANDEX_MARKET_API_KEY:
            #     return await self._parse_via_api(product_id)

            # Загружаем HTML страницы
            html = await self.fetch_html(url)

            if not html:
                return ParsedItemData(
                    success=False,
                    error="Не удалось загрузить страницу товара"
                )

            # Парсим HTML
            soup = BeautifulSoup(html, 'html.parser')

            # Извлекаем данные
            title = self._extract_title(soup)
            price = self._extract_price_value(soup)
            images = self._extract_images(soup)
            description = self._extract_description(soup)

            return ParsedItemData(
                title=title,
                description=description,
                price=price,
                currency="RUB",
                image_url=images[0] if images else None,
                images=images,
                marketplace=MarketplaceType.yandex_market,
                success=True
            )

        except Exception as e:
            return ParsedItemData(
                success=False,
                error=f"Ошибка парсинга: {str(e)}"
            )

    def _extract_product_id(self, url: str) -> str | None:
        """Извлечение ID товара из URL"""
        # Формат: /product/123456789
        match = re.search(r'/product[/-](\d+)', url)
        if match:
            return match.group(1)
        return None

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        """Извлечение названия товара"""
        # Ищем в JSON-LD
        json_ld = soup.find('script', type='application/ld+json')
        if json_ld:
            try:
                data = json.loads(json_ld.string)
                if 'name' in data:
                    return data['name']
            except Exception:
                pass

        # Ищем в мета-тегах
        og_title = soup.find('meta', property='og:title')
        if og_title:
            return og_title.get('content')

        # Ищем в заголовке
        title_tag = soup.find('h1')
        if title_tag:
            return title_tag.get_text(strip=True)

        return None

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        """Извлечение описания"""
        og_description = soup.find('meta', property='og:description')
        if og_description:
            return og_description.get('content')
        return None

    def _extract_price_value(self, soup: BeautifulSoup) -> float | None:
        """Извлечение цены"""
        # Ищем в JSON-LD
        json_ld = soup.find('script', type='application/ld+json')
        if json_ld:
            try:
                data = json.loads(json_ld.string)
                if 'offers' in data and 'price' in data['offers']:
                    return float(data['offers']['price'])
            except Exception:
                pass

        # Яндекс.Маркет часто использует React и данные в JavaScript
        # Ищем в data-атрибутах или JavaScript переменных
        script_tags = soup.find_all('script')

        for script in script_tags:
            if script.string and '"price"' in script.string:
                # Ищем цену в JS объектах
                price_match = re.search(r'"price["\s:]+(\d+)', script.string)
                if price_match:
                    try:
                        return float(price_match.group(1))
                    except Exception:
                        pass

        return None

    def _extract_images(self, soup: BeautifulSoup) -> list:
        """Извлечение изображений"""
        images = []

        # Ищем в мета-тегах
        og_image = soup.find('meta', property='og:image')
        if og_image:
            img_url = og_image.get('content')
            # Увеличиваем размер изображения если возможно
            img_url = re.sub(r'/\d+x\d+/', '/800x800/', img_url)
            images.append(img_url)

        # Ищем изображения в галерее
        img_tags = soup.find_all('img', src=re.compile(r'avatars\.(mds\.)?yandex', re.I))

        for img in img_tags[:5]:  # Первые 5 изображений
            src = img.get('src')
            if src and src not in images:
                # Увеличиваем размер
                src = re.sub(r'/\d+x\d+/', '/800x800/', src)
                images.append(src)

        return images

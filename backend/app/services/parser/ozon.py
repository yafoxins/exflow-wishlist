"""
Парсер товаров Ozon

ВАЖНО: Это базовая реализация через парсинг HTML.
В продакшене рекомендуется использовать официальный API Ozon,
если у вас есть партнёрский доступ.

Места для доработки отмечены комментариями TODO: OFFICIAL API
"""
import json
import re

from bs4 import BeautifulSoup

from app.models.item import MarketplaceType
from app.schemas.item import ParsedItemData
from app.services.parser.base import BaseParser


class OzonParser(BaseParser):
    """
    Парсер товаров с Ozon

    Поддерживаемые форматы URL:
    - https://www.ozon.ru/product/название-товара-123456789/
    - https://ozon.ru/product/название-123456789/
    """

    def can_parse(self, url: str) -> bool:
        """Проверка, является ли ссылка ссылкой на Ozon"""
        return "ozon.ru" in url and "/product/" in url

    async def parse(self, url: str) -> ParsedItemData:
        """
        Парсинг товара с Ozon

        TODO: OFFICIAL API - замените на вызов официального API
        if settings.OZON_API_KEY:
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
            # if settings.OZON_API_KEY:
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
                marketplace=MarketplaceType.ozon,
                success=True
            )

        except Exception as e:
            return ParsedItemData(
                success=False,
                error=f"Ошибка парсинга: {str(e)}"
            )

    def _extract_product_id(self, url: str) -> str | None:
        """Извлечение ID товара из URL"""
        # Формат: /product/название-123456789/
        match = re.search(r'-(\d+)/?$', url)
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

        # Ищем в мета-тегах
        price_meta = soup.find('meta', attrs={'name': 'product:price:amount'})
        if price_meta:
            try:
                return float(price_meta.get('content'))
            except Exception:
                pass

        # Ищем в тексте (классы могут меняться)
        # Ozon часто меняет вёрстку, поэтому это может требовать обновления
        price_patterns = [
            {'tag': 'span', 'attrs': {'data-widget': 'webPrice'}},
            {'tag': 'div', 'class_': re.compile(r'.*price.*', re.I)},
        ]

        for pattern in price_patterns:
            price_elem = soup.find(**pattern)
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price = self.extract_price(price_text)
                if price:
                    return price

        return None

    def _extract_images(self, soup: BeautifulSoup) -> list:
        """Извлечение изображений"""
        images = []

        # Ищем в мета-тегах
        og_image = soup.find('meta', property='og:image')
        if og_image:
            images.append(og_image.get('content'))

        # Ищем изображения в галерее (может быть в разных местах)
        img_tags = soup.find_all('img', src=re.compile(r'cdn.*ozon', re.I))

        for img in img_tags[:5]:  # Первые 5 изображений
            src = img.get('src')
            if src and src not in images:
                # Пытаемся получить большое изображение
                src = re.sub(r'/wc\d+/', '/wc1000/', src)
                images.append(src)

        return images

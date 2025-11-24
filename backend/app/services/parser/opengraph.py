"""
Универсальный парсер через OpenGraph мета-теги

Используется для всех сайтов, которые не имеют специализированного парсера.
Большинство современных сайтов поддерживают OpenGraph.
"""

from bs4 import BeautifulSoup

from app.models.item import MarketplaceType
from app.schemas.item import ParsedItemData
from app.services.parser.base import BaseParser


class OpenGraphParser(BaseParser):
    """
    Универсальный парсер через OpenGraph мета-теги

    Работает с любыми сайтами, поддерживающими OpenGraph/Schema.org
    """

    def can_parse(self, url: str) -> bool:
        """Этот парсер может работать с любыми ссылками"""
        return True

    async def parse(self, url: str) -> ParsedItemData:
        """
        Парсинг товара через OpenGraph мета-теги
        """
        try:
            # Загружаем HTML страницы
            html = await self.fetch_html(url)

            if not html:
                return ParsedItemData(
                    success=False,
                    error="Не удалось загрузить страницу"
                )

            # Парсим HTML
            soup = BeautifulSoup(html, 'html.parser')

            # Извлекаем данные
            title = self._extract_title(soup)
            description = self._extract_description(soup)
            price = self._extract_price_value(soup)
            images = self._extract_images(soup)

            # Если не удалось извлечь хотя бы заголовок, считаем парсинг неудачным
            if not title:
                return ParsedItemData(
                    success=False,
                    error="Не удалось извлечь информацию о товаре"
                )

            return ParsedItemData(
                title=title,
                description=description,
                price=price,
                currency="RUB",
                image_url=images[0] if images else None,
                images=images,
                marketplace=MarketplaceType.other,
                success=True
            )

        except Exception as e:
            return ParsedItemData(
                success=False,
                error=f"Ошибка парсинга: {str(e)}"
            )

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        """Извлечение названия"""
        # OpenGraph
        og_title = soup.find('meta', property='og:title')
        if og_title:
            return og_title.get('content')

        # Twitter Card
        twitter_title = soup.find('meta', attrs={'name': 'twitter:title'})
        if twitter_title:
            return twitter_title.get('content')

        # Schema.org Product
        product_name = soup.find('meta', attrs={'itemprop': 'name'})
        if product_name:
            return product_name.get('content')

        # Обычный title
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.get_text(strip=True)

        # H1
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.get_text(strip=True)

        return None

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        """Извлечение описания"""
        # OpenGraph
        og_description = soup.find('meta', property='og:description')
        if og_description:
            return og_description.get('content')

        # Twitter Card
        twitter_description = soup.find('meta', attrs={'name': 'twitter:description'})
        if twitter_description:
            return twitter_description.get('content')

        # Meta description
        meta_description = soup.find('meta', attrs={'name': 'description'})
        if meta_description:
            return meta_description.get('content')

        # Schema.org
        product_description = soup.find('meta', attrs={'itemprop': 'description'})
        if product_description:
            return product_description.get('content')

        return None

    def _extract_price_value(self, soup: BeautifulSoup) -> float | None:
        """Извлечение цены"""
        # Schema.org Product
        price_meta = soup.find('meta', attrs={'itemprop': 'price'})
        if price_meta:
            try:
                return float(price_meta.get('content'))
            except Exception:
                pass

        # OpenGraph product:price
        og_price = soup.find('meta', property='product:price:amount')
        if og_price:
            try:
                return float(og_price.get('content'))
            except Exception:
                pass

        return None

    def _extract_images(self, soup: BeautifulSoup) -> list:
        """Извлечение изображений"""
        images = []

        # OpenGraph
        og_images = soup.find_all('meta', property='og:image')
        for og_image in og_images[:5]:
            img_url = og_image.get('content')
            if img_url and img_url not in images:
                images.append(img_url)

        # Twitter Card
        if not images:
            twitter_image = soup.find('meta', attrs={'name': 'twitter:image'})
            if twitter_image:
                img_url = twitter_image.get('content')
                if img_url:
                    images.append(img_url)

        # Schema.org
        if not images:
            product_image = soup.find('meta', attrs={'itemprop': 'image'})
            if product_image:
                img_url = product_image.get('content')
                if img_url:
                    images.append(img_url)

        return images

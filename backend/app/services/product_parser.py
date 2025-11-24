"""
Главный сервис для парсинга товаров

Выбирает подходящий парсер в зависимости от URL и возвращает данные товара
"""
from app.schemas.item import ParsedItemData
from app.services.parser import OpenGraphParser, OzonParser, WildberriesParser, YandexMarketParser


class ProductParserService:
    """
    Сервис парсинга товаров

    Автоматически выбирает подходящий парсер в зависимости от URL
    """

    def __init__(self):
        # Инициализируем все парсеры
        self.parsers = [
            WildberriesParser(),
            OzonParser(),
            YandexMarketParser(),
            # OpenGraph всегда последний (fallback для любых ссылок)
            OpenGraphParser()
        ]

    async def parse_url(self, url: str) -> ParsedItemData:
        """
        Парсинг товара по URL

        Args:
            url: Ссылка на товар

        Returns:
            Данные товара
        """
        # Проверяем URL
        if not url or not url.startswith('http'):
            return ParsedItemData(
                success=False,
                error="Некорректная ссылка. URL должен начинаться с http:// или https://"
            )

        # Ищем подходящий парсер
        for parser in self.parsers:
            if parser.can_parse(url):
                try:
                    result = await parser.parse(url)
                    return result
                except Exception:
                    # Если парсер упал с ошибкой, пробуем следующий
                    continue

        # Если ни один парсер не сработал
        return ParsedItemData(
            success=False,
            error="Не удалось распарсить ссылку"
        )


# Создаём глобальный экземпляр сервиса
product_parser = ProductParserService()

"""
Парсеры товаров из маркетплейсов
"""
from app.services.parser.base import BaseParser
from app.services.parser.opengraph import OpenGraphParser
from app.services.parser.ozon import OzonParser
from app.services.parser.wildberries import WildberriesParser
from app.services.parser.yandex_market import YandexMarketParser

__all__ = [
    "BaseParser",
    "WildberriesParser",
    "OzonParser",
    "YandexMarketParser",
    "OpenGraphParser"
]

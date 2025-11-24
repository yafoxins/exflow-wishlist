"""
Parser API endpoint
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.item import ParsedItemData
from app.services.product_parser import product_parser

router = APIRouter()


class ParseRequest(BaseModel):
    """Запрос на парсинг URL"""
    url: str


@router.post("/parse-url", response_model=ParsedItemData)
async def parse_product_url(
    request: ParseRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Парсинг товара по URL

    Принимает ссылку на товар и возвращает:
    - Название
    - Описание
    - Цену
    - Изображения
    - Маркетплейс

    Поддерживаемые магазины:
    - Wildberries
    - Ozon
    - Яндекс.Маркет
    - Любые сайты с OpenGraph метатегами
    """
    result = await product_parser.parse_url(request.url)
    return result

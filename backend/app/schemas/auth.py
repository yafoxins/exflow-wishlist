"""
Pydantic схемы для аутентификации
"""

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    """Схема ответа с токеном"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Данные, хранимые в JWT токене"""
    user_id: int
    email: str | None = None


class UserLogin(BaseModel):
    """Схема для логина"""
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    """Схема для регистрации"""
    email: EmailStr
    password: str
    full_name: str | None = None
    username: str | None = None


class PasswordReset(BaseModel):
    """Схема для сброса пароля"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Подтверждение нового пароля"""
    token: str
    new_password: str


class EmailVerification(BaseModel):
    """Подтверждение email"""
    token: str

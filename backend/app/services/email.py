"""
Сервис отправки email уведомлений
"""
from pathlib import Path

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema

from app.config import settings

# Конфигурация email
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER or "",
    MAIL_PASSWORD=settings.SMTP_PASSWORD or "",
    MAIL_FROM=settings.SMTP_FROM,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_STARTTLS=settings.SMTP_TLS,
    MAIL_SSL_TLS=settings.SMTP_SSL,
    USE_CREDENTIALS=bool(settings.SMTP_USER),
    TEMPLATE_FOLDER=Path(__file__).parent.parent / 'templates'
)

fastmail = FastMail(conf)


class EmailService:
    """Сервис для отправки email"""

    @staticmethod
    async def send_verification_email(email: str, token: str):
        """Отправка письма подтверждения регистрации"""
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Подтверждение регистрации в Wishlist</h2>
            <p>Здравствуйте!</p>
            <p>Спасибо за регистрацию в нашем сервисе.</p>
            <p>Пожалуйста, подтвердите ваш email, перейдя по ссылке:</p>
            <p><a href="{verification_url}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Подтвердить email</a></p>
            <p>Или скопируйте ссылку в браузер:<br>{verification_url}</p>
            <p>Ссылка действительна 24 часа.</p>
            <br>
            <p>С уважением,<br>Команда Wishlist</p>
        </body>
        </html>
        """

        message = MessageSchema(
            subject="Подтверждение регистрации в Wishlist",
            recipients=[email],
            body=html,
            subtype="html"
        )

        await fastmail.send_message(message)

    @staticmethod
    async def send_event_reminder(email: str, wishlist_title: str, days_left: int):
        """Напоминание о приближающемся событии"""
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Напоминание о событии</h2>
            <p>Привет!</p>
            <p>До события "<strong>{wishlist_title}</strong>" осталось {days_left} дней!</p>
            <p>Не забудьте проверить свой список желаний и поделиться им с друзьями.</p>
            <p><a href="{settings.FRONTEND_URL}/wishlists">Перейти к спискам</a></p>
            <br>
            <p>С уважением,<br>Команда Wishlist</p>
        </body>
        </html>
        """

        message = MessageSchema(
            subject=f"Напоминание: до {wishlist_title} осталось {days_left} дней",
            recipients=[email],
            body=html,
            subtype="html"
        )

        await fastmail.send_message(message)

    @staticmethod
    async def send_reservation_notification(email: str, item_title: str, reserver_name: str):
        """Уведомление владельцу о бронировании подарка"""
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Подарок забронирован!</h2>
            <p>Привет!</p>
            <p>{reserver_name} забронировал подарок из вашего списка:</p>
            <p><strong>{item_title}</strong></p>
            <p><a href="{settings.FRONTEND_URL}/wishlists">Посмотреть списки</a></p>
            <br>
            <p>С уважением,<br>Команда Wishlist</p>
        </body>
        </html>
        """

        message = MessageSchema(
            subject="Подарок забронирован!",
            recipients=[email],
            body=html,
            subtype="html"
        )

        await fastmail.send_message(message)


# Создаём глобальный экземпляр
email_service = EmailService()

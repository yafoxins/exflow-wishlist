"""
Telegram бот для Wishlist

Функции:
- Авторизация через Telegram
- Уведомления о бронировании подарков
- Напоминания о событиях
- Быстрые команды
"""

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

from app.config import settings


class WishlistBot:
    """Telegram бот для Wishlist"""

    def __init__(self):
        self.token = settings.TELEGRAM_BOT_TOKEN
        self.webapp_url = settings.TELEGRAM_WEBAPP_URL or settings.FRONTEND_URL
        self.app: Application | None = None

    def initialize(self) -> Application:
        """Инициализация бота"""
        if not self.token:
            raise ValueError("TELEGRAM_BOT_TOKEN не установлен в настройках")

        # Создаём приложение
        self.app = Application.builder().token(self.token).build()

        # Регистрируем обработчики команд
        self.app.add_handler(CommandHandler("start", self.cmd_start))
        self.app.add_handler(CommandHandler("help", self.cmd_help))
        self.app.add_handler(CommandHandler("my_lists", self.cmd_my_lists))
        self.app.add_handler(CommandHandler("add", self.cmd_add_item))

        return self.app

    async def cmd_start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Команда /start"""
        user = update.effective_user

        # Создаём кнопки с WebApp
        keyboard = [
            [InlineKeyboardButton(
                "🎁 Открыть ExFlow",
                web_app=WebAppInfo(url=self.webapp_url)
            )],
            [InlineKeyboardButton(
                "📋 Мои списки",
                callback_data="my_lists"
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_text(
            f"Привет, {user.first_name}! 👋\n\n"
            f"Я ExFlow — бот для управления списками желаний.\n\n"
            f"С моей помощью ты можешь:\n"
            f"• Создавать списки желаний\n"
            f"• Делиться ими с друзьями\n"
            f"• Получать уведомления о бронировании подарков\n"
            f"• Напоминания о важных событиях\n\n"
            f"Нажми на кнопку ниже, чтобы начать!",
            reply_markup=reply_markup
        )

    async def cmd_help(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Команда /help"""
        help_text = """
🎁 <b>Команды бота ExFlow</b>

/start - Начать работу
/help - Показать эту справку
/my_lists - Мои списки желаний
/add - Добавить новое желание

<b>Веб-версия</b>
Откройте полную версию приложения, нажав на кнопку "Открыть ExFlow"

<b>Уведомления</b>
Вы будете получать уведомления:
• Когда кто-то забронировал подарок из вашего списка
• За 7 дней до важного события
        """

        keyboard = [
            [InlineKeyboardButton(
                "🎁 Открыть ExFlow",
                web_app=WebAppInfo(url=self.webapp_url)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_text(
            help_text,
            parse_mode='HTML',
            reply_markup=reply_markup
        )

    async def cmd_my_lists(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Команда /my_lists"""
        # TODO: Получить списки пользователя из БД через telegram_id

        keyboard = [
            [InlineKeyboardButton(
                "📋 Открыть мои списки",
                web_app=WebAppInfo(url=f"{self.webapp_url}/wishlists")
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_text(
            "Ваши списки желаний доступны в веб-приложении:",
            reply_markup=reply_markup
        )

    async def cmd_add_item(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Команда /add"""
        keyboard = [
            [InlineKeyboardButton(
                "➕ Добавить желание",
                web_app=WebAppInfo(url=f"{self.webapp_url}/items/new")
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_text(
            "Добавьте новое желание в веб-приложении:",
            reply_markup=reply_markup
        )

    async def send_reservation_notification(
        self,
        telegram_id: int,
        item_title: str,
        reserver_name: str
    ):
        """
        Отправка уведомления о бронировании подарка

        Args:
            telegram_id: Telegram ID владельца списка
            item_title: Название забронированного подарка
            reserver_name: Имя того, кто забронировал
        """
        if not self.app:
            return

        text = f"🎁 <b>Подарок забронирован!</b>\n\n" \
               f"{reserver_name} хочет подарить вам:\n" \
               f"<i>{item_title}</i>\n\n" \
               f"Поздравляем! 🎉"

        try:
            await self.app.bot.send_message(
                chat_id=telegram_id,
                text=text,
                parse_mode='HTML'
            )
        except Exception as e:
            print(f"Ошибка отправки уведомления в Telegram: {e}")

    async def send_event_reminder(
        self,
        telegram_id: int,
        wishlist_title: str,
        days_left: int
    ):
        """
        Отправка напоминания о приближающемся событии

        Args:
            telegram_id: Telegram ID пользователя
            wishlist_title: Название списка/события
            days_left: Сколько дней осталось
        """
        if not self.app:
            return

        text = f"⏰ <b>Напоминание о событии</b>\n\n" \
               f"До <i>{wishlist_title}</i> осталось {days_left} дней!\n\n" \
               f"Не забудьте поделиться списком желаний с друзьями."

        keyboard = [
            [InlineKeyboardButton(
                "📋 Открыть список",
                web_app=WebAppInfo(url=self.webapp_url)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        try:
            await self.app.bot.send_message(
                chat_id=telegram_id,
                text=text,
                parse_mode='HTML',
                reply_markup=reply_markup
            )
        except Exception as e:
            print(f"Ошибка отправки напоминания в Telegram: {e}")


# Глобальный экземпляр бота
wishlist_bot = WishlistBot()

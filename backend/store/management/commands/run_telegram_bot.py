from django.core.management.base import BaseCommand
from store.telegram_bot_daemon import run_polling


class Command(BaseCommand):
    help = 'Runs the interactive Telegram Bot polling daemon for Toomakt Atelier'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting interactive Toomakt Telegram Bot daemon..."))
        self.stdout.write(self.style.NOTICE("Listening for Telegram commands and admin verification requests..."))
        try:
            run_polling()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("Telegram Bot daemon stopped."))

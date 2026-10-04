import os
import sys
import logging
from django.apps import AppConfig

logger = logging.getLogger('store.apps')


class StoreConfig(AppConfig):
    name = 'store'

    def ready(self):
        # Only start polling daemon when running the dev server main process or web worker
        # Do not start during migrations, shell, or collectstatic
        is_runserver = 'runserver' in sys.argv
        is_main = (os.environ.get('RUN_MAIN') == 'true') or ('--noreload' in sys.argv)

        if is_runserver and is_main:
            try:
                from .telegram_bot_daemon import start_telegram_polling_in_background
                start_telegram_polling_in_background()
                print("[toomakt] [+] Telegram bot background daemon running for @ToomaktBot")
                logger.info("Auto-launched Telegram bot background daemon for @ToomaktBot")
            except Exception as e:
                print(f"[toomakt] [!] Failed to auto-launch Telegram bot daemon: {e}")
                logger.warning(f"Failed to auto-launch Telegram bot daemon: {e}")


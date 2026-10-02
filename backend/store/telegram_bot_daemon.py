import os
import time
import json
import logging
import threading
import urllib.request
from django.conf import settings

logger = logging.getLogger('store.telegram.daemon')

_POLLING_THREAD = None
_IS_RUNNING = False


def run_polling(token: str = None) -> None:
    """
    Long polling listener for Telegram Bot API updates.
    Routes every update through `handle_telegram_update`.
    """
    global _IS_RUNNING
    from .telegram_service import handle_telegram_update

    bot_token = token or getattr(settings, 'TELEGRAM_BOT_TOKEN', os.environ.get('TELEGRAM_BOT_TOKEN', ''))
    if not bot_token:
        logger.error("Cannot run Telegram bot polling: TELEGRAM_BOT_TOKEN is missing.")
        return

    logger.info("Starting Telegram Bot Polling Daemon for @ToomaktBot...")
    _IS_RUNNING = True
    last_update_id = 0

    while _IS_RUNNING:
        try:
            url = f"https://api.telegram.org/bot{bot_token}/getUpdates?offset={last_update_id}&timeout=20"
            req = urllib.request.Request(url, headers={'User-Agent': 'ToomaktBot/1.0'})
            
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if not data.get('ok'):
                    time.sleep(3)
                    continue

                results = data.get('result', [])
                for upd in results:
                    upd_id = upd.get('update_id')
                    if upd_id:
                        last_update_id = max(last_update_id, upd_id + 1)

                    try:
                        handle_telegram_update(upd)
                    except Exception as handler_err:
                        logger.error(f"Error handling Telegram update {upd_id}: {handler_err}", exc_info=True)

        except urllib.error.URLError as e:
            # Typical for network timeout during long-poll, normal
            logger.debug(f"Telegram polling timeout or connection glitch: {e}")
            time.sleep(1)
        except Exception as e:
            logger.error(f"Telegram polling exception: {e}")
            time.sleep(4)


def start_telegram_polling_in_background() -> None:
    """
    Spawns the polling loop in a single, safe background daemon thread.
    Guarded against duplicate spawns.
    """
    global _POLLING_THREAD, _IS_RUNNING
    if _IS_RUNNING or (_POLLING_THREAD and _POLLING_THREAD.is_alive()):
        logger.info("Telegram polling thread already active.")
        return

    _POLLING_THREAD = threading.Thread(target=run_polling, daemon=True, name="TelegramBotDaemon")
    _POLLING_THREAD.start()
    logger.info("TelegramBotDaemon thread started successfully.")

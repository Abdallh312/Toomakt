"""
Toomakt 24/7 Telegram Bot Supervisor Service.
Maintains a resilient, persistent polling connection for @ToomaktBot.
Includes auto-restart, single-instance pidfile locking, and rotating file logs.
Safe for pythonw.exe and headless background execution.
"""
import os
import sys
import time
import atexit
import signal
import ctypes
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

# Paths setup
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

LOGS_DIR = BACKEND_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)
PID_FILE = BACKEND_DIR / 'telegram_bot.pid'
LOG_FILE = LOGS_DIR / 'telegram_bot.log'

# Under pythonw.exe, sys.stdout and sys.stderr are None.
# Redirect them immediately to LOG_FILE so prints & tracebacks are safely captured.
if sys.stdout is None or not hasattr(sys.stdout, 'write'):
    sys.stdout = open(LOG_FILE, 'a', encoding='utf-8', buffering=1)
if sys.stderr is None or not hasattr(sys.stderr, 'write'):
    sys.stderr = open(LOG_FILE, 'a', encoding='utf-8', buffering=1)

# Setup logging
logger = logging.getLogger('toomakt.bot.service')
logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    '[%(asctime)s] [%(levelname)s] (PID %(process)d) %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# File handler with rotation (up to 5MB, keep 3 backups)
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=3, encoding='utf-8')
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.INFO)
logger.addHandler(file_handler)


def is_pid_alive(pid: int) -> bool:
    """Check if a process with given PID exists on Windows or Linux."""
    if pid <= 0:
        return False
    try:
        if os.name == 'nt':
            handle = ctypes.windll.kernel32.OpenProcess(0x1000, False, int(pid))
            if handle:
                ctypes.windll.kernel32.CloseHandle(handle)
                return True
            return False
        else:
            os.kill(pid, 0)
            return True
    except OSError:
        return False
    except Exception:
        return False


def acquire_pid_lock():
    """Ensure only one instance runs at any time."""
    if PID_FILE.exists():
        try:
            content = PID_FILE.read_text().strip()
            old_pid = int(content)
            if is_pid_alive(old_pid):
                logger.warning(f"Bot service is already running with PID {old_pid}. Exiting.")
                print(f"[toomakt-bot] Already running with PID {old_pid}.", file=sys.stdout)
                sys.exit(0)
            else:
                logger.info(f"Removing stale PID file from dead process {old_pid}.")
                PID_FILE.unlink(missing_ok=True)
        except Exception as e:
            logger.warning(f"Could not read existing PID file: {e}")
            PID_FILE.unlink(missing_ok=True)

    current_pid = os.getpid()
    PID_FILE.write_text(str(current_pid))
    logger.info(f"Acquired PID lock for process {current_pid}.")


def release_pid_lock():
    """Remove PID file on clean exit."""
    try:
        if PID_FILE.exists():
            content = PID_FILE.read_text().strip()
            if content == str(os.getpid()):
                PID_FILE.unlink(missing_ok=True)
                logger.info(f"Released PID lock for process {os.getpid()}.")
    except Exception:
        pass


atexit.register(release_pid_lock)


def signal_handler(signum, frame):
    logger.info(f"Received termination signal ({signum}). Shutting down cleanly...")
    release_pid_lock()
    sys.exit(0)


try:
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
except Exception:
    pass


def main():
    acquire_pid_lock()

    logger.info("=" * 60)
    logger.info("Initializing Toomakt 24/7 Telegram Bot Supervisor...")
    logger.info(f"Working Directory: {BACKEND_DIR}")
    logger.info(f"Log File: {LOG_FILE}")
    logger.info("=" * 60)

    # Initialize Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')
    try:
        import django
        django.setup()
        from django.conf import settings
        from store.telegram_bot_daemon import run_polling
        from store.models import TelegramAdminUser
        admin_count = TelegramAdminUser.objects.filter(is_active=True).count()
        logger.info(f"Django initialized successfully. Active admin count: {admin_count}")
    except Exception as e:
        logger.critical(f"Failed to initialize Django environment: {e}", exc_info=True)
        time.sleep(10)
        sys.exit(1)

    # Persistent 24/7 Supervisor Loop
    consecutive_crashes = 0
    while True:
        try:
            logger.info("Launching Telegram Bot polling loop...")
            run_polling()
            logger.warning("Polling loop terminated normally.")
            break
        except KeyboardInterrupt:
            logger.info("Bot supervisor received KeyboardInterrupt. Exiting.")
            break
        except Exception as crash_err:
            consecutive_crashes += 1
            backoff = min(30, 3 * consecutive_crashes)
            logger.error(
                f"Polling loop crashed with unexpected error: {crash_err}. "
                f"Supervisor restarting in {backoff} seconds (Crash #{consecutive_crashes})...",
                exc_info=True
            )
            time.sleep(backoff)


if __name__ == '__main__':
    main()

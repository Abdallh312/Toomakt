"""
Unified 24/7 Cloud Entrypoint for Toomakt Atelier.
Launches both Gunicorn (for Web & Checkout APIs) and the Telegram Bot Polling Daemon concurrently.
Works seamlessly on Render, Railway, Fly.io, or any Ubuntu/Debian Linux VPS.
"""
import os
import sys
import time
import subprocess
import threading
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
os.chdir(BACKEND_DIR)
sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')


def run_bot_daemon():
    """Background runner for Telegram Bot long-polling."""
    time.sleep(2)  # Allow migrations & WSGI startup to settle
    print("[toomakt-cloud] Starting 24/7 Telegram Bot Daemon thread...", flush=True)
    while True:
        try:
            import django
            django.setup()
            from store.telegram_bot_daemon import run_polling
            run_polling()
        except Exception as e:
            print(f"[toomakt-cloud] [!] Bot daemon glitch: {e}. Retrying in 5 seconds...", flush=True)
            time.sleep(5)


def main():
    print("=" * 65, flush=True)
    print("  * TOOMAKT 24/7 CLOUD HOSTING SUPERVISOR *", flush=True)
    print("=" * 65, flush=True)

    # 1. Apply database migrations
    print("[toomakt-cloud] Applying database migrations...", flush=True)
    try:
        subprocess.run([sys.executable, "manage.py", "migrate", "--noinput"], check=False)
    except Exception as e:
        print(f"[toomakt-cloud] Migration notice: {e}", flush=True)

    # 2. Collect static files if directory exists
    try:
        subprocess.run([sys.executable, "manage.py", "collectstatic", "--noinput"], check=False)
    except Exception:
        pass

    # 3. Launch Telegram Bot in persistent background thread
    bot_thread = threading.Thread(target=run_bot_daemon, daemon=True, name="ToomaktTelegramBotDaemon")
    bot_thread.start()

    # 4. Start Gunicorn Web Server for REST API and Admin
    port = os.environ.get("PORT", "8000")
    workers = os.environ.get("WEB_CONCURRENCY", "2")
    print(f"[toomakt-cloud] Starting Gunicorn web server on port {port}...", flush=True)

    cmd = [
        sys.executable, "-m", "gunicorn",
        "toomakt_backend.wsgi:application",
        "--bind", f"0.0.0.0:{port}",
        "--workers", str(workers),
        "--timeout", "120"
    ]
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("[toomakt-cloud] Shutting down supervisor cleanly...", flush=True)


if __name__ == '__main__':
    main()

#!/usr/bin/env python
"""Django's command-line utility for administrative tasks with integrated Vite frontend launcher."""
import os
import sys
import subprocess
import socket
import atexit
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

FRONTEND_PORTS = [5176, 5177, 5173, 5174, 5175]


def is_port_in_use(port: int, host: str = '127.0.0.1') -> bool:
    """Check if a network port is already open and accepting connections."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.4)
            return s.connect_ex((host, port)) == 0
    except Exception:
        return False


def get_active_frontend_port():
    """Return the active port if frontend is running, else None."""
    for p in FRONTEND_PORTS:
        if is_port_in_use(p):
            return p
    return None


def launch_frontend_dev_server():
    """Launch the frontend Vite dev server concurrently when runserver is called."""
    backend_dir = Path(__file__).resolve().parent
    frontend_dir = backend_dir.parent

    # Detect package.json in the parent directory
    package_json = frontend_dir / "package.json"
    if not package_json.exists():
        return

    active_port = get_active_frontend_port()
    frontend_proc = None

    if active_port:
        print(f"\n[toomakt] [+] Frontend Vite dev server is already running on http://localhost:{active_port}/")
    else:
        print("\n[toomakt] [>>] Starting Frontend Vite Dev Server (npm run dev)...")
        try:
            # On Windows, use shell=True so npm.cmd resolves properly
            frontend_proc = subprocess.Popen(
                "npm run dev",
                cwd=str(frontend_dir),
                shell=True
            )

            def cleanup():
                if frontend_proc and frontend_proc.poll() is None:
                    try:
                        # Kill the process tree on Windows cleanly
                        subprocess.run(
                            f"taskkill /F /T /PID {frontend_proc.pid}",
                            shell=True,
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL
                        )
                    except Exception:
                        try:
                            frontend_proc.terminate()
                        except Exception:
                            pass

            atexit.register(cleanup)
            active_port = 5176
        except Exception as e:
            print(f"[toomakt] [!] Could not auto-start frontend dev server: {e}")

    port_display = active_port or 5176

    # Display stylish unified banner (clean ASCII for 100% terminal compatibility)
    print("\n" + "=" * 70)
    print("  * TOOMAKT ARTISANAL CONFECTIONERY - UNIFIED DEV ENVIRONMENT *")
    print("=" * 70)
    print(f"  --> Django Backend Server: http://127.0.0.1:8000/")
    print(f"  --> Vite Frontend App:     http://localhost:{port_display}/")
    print(f"  --> Confectionery API:     http://127.0.0.1:8000/api/products/")
    print("=" * 70 + "\n")


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')

    # If the user is running `runserver`, launch frontend if this is the parent process
    is_runserver = any('runserver' in arg for arg in sys.argv)
    is_parent_process = os.environ.get('RUN_MAIN') != 'true'

    if is_runserver and is_parent_process:
        launch_frontend_dev_server()

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()

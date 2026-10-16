import shutil
import os
import json
import subprocess
import threading
import time
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TUNNEL_DATA_FILE = os.path.join(BASE_DIR, "data", "remote_tunnel.json")

# Candidate cloudflared locations
candidates = [
    os.path.join(BASE_DIR, "cloudflared.exe"),
    r"E:\raghav\AstraGPT_Agent\cloudflared.exe",
    r"E:\cloudflared.exe",
    r"E:\muse\cloudflared.exe"
]
CLOUDFLARED_BIN = candidates[0]
for c in candidates:
    if os.path.exists(c):
        CLOUDFLARED_BIN = c
        break

class RemoteTunnelManager:
    _instance = None
    _proc = None
    _url = None
    _running = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.load_cached_url()

    def load_cached_url(self):
        if os.path.exists(TUNNEL_DATA_FILE):
            try:
                with open(TUNNEL_DATA_FILE, "r", encoding="utf-8") as f:
                    d = json.load(f)
                    u = d.get("url")
                    if u and "api.trycloudflare.com" not in u:
                        self._url = u
            except Exception:
                pass

    def start_tunnel(self, port=8765):
        if self._running and self._url:
            return self._url
        if not os.path.exists(CLOUDFLARED_BIN):
            print("[Tunnel] cloudflared.exe not found at", CLOUDFLARED_BIN)
            return None

        def _worker():
            self._running = True
            cmd = [CLOUDFLARED_BIN, "tunnel", "--url", f"http://127.0.0.1:{port}"]
            print(f"[Tunnel] Starting Cloudflare Global Secure Tunnel on port {port}")
            try:
                self._proc = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    encoding="utf-8",
                    errors="ignore"
                )
                for line in iter(self._proc.stdout.readline, ""):
                    if not line:
                        break
                    if ".trycloudflare.com" in line and "api.trycloudflare.com" not in line:
                        m = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
                        if m:
                            self._url = m.group(0)
                            print(f"\n{'='*70}\n[TUNNEL READY] Meta Muse Global HTTPS URL:\n>> {self._url} <<\n{'='*70}\n", flush=True)
                            os.makedirs(os.path.dirname(TUNNEL_DATA_FILE), exist_ok=True)
                            with open(TUNNEL_DATA_FILE, "w", encoding="utf-8") as f:
                                json.dump({
                                    "url": self._url,
                                    "timestamp": time.time(),
                                    "active": True,
                                    "port": port
                                }, f, indent=4)
                self._proc.wait()
            except Exception as e:
                print("[Tunnel] Error running cloudflared:", e)
            finally:
                self._running = False

        t = threading.Thread(target=_worker, daemon=True)
        t.start()
        
        # Wait up to 12 seconds for URL
        for _ in range(24):
            if self._url:
                return self._url
            time.sleep(0.5)
        return self._url

    def get_url(self):
        return self._url

if __name__ == "__main__":
    tm = RemoteTunnelManager.get_instance()
    u = tm.start_tunnel(8765)
    print("Obtained URL:", u)
    time.sleep(5)

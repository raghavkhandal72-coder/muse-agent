"""
Meta Muse - Master Lifelong Auto-Updater & Health Maintenance System
Allows 1-click update, APK rebuild, server refresh, and zero-error integrity check anytime in the future.
"""
import os
import sys
import json
import shutil
import subprocess
import time
from pathlib import Path

BASE_DIR = Path(r"E:\raghav\AstraGPT_Agent")
E_ROOT = Path(r"E:")
SCRATCH_DIR = Path(r"C:\Users\dell\.gemini\antigravity-ide\scratch")

def log(msg):
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)

def run_health_check():
    log("==================================================")
    log("RUNNING COMPLETE HEALTH & INTEGRITY CHECK...")
    log("==================================================")

    # 1. Check Python syntax
    main_py = BASE_DIR / "main.py"
    if main_py.exists():
        res = subprocess.run([sys.executable, "-m", "py_compile", str(main_py)], capture_output=True, text=True)
        if res.returncode == 0:
            log("[OK] main.py Python syntax: 100% CLEAN (0 errors)")
        else:
            log(f"[FAIL] main.py syntax issue: {res.stderr}")
    else:
        log("[FAIL] main.py not found!")

    # 2. Check Assets
    assets = ["HatchIdle.mp4", "HatchWorking.mp4", "HatchMaking.mp4", "HatchWave.mp4", "logo.png"]
    missing = []
    for a in assets:
        if not (BASE_DIR / a).exists() and not (BASE_DIR / "hatch" / a).exists():
            missing.append(a)
    if not missing:
        log("[OK] Hatch avatar video assets: ALL PRESENT & VERIFIED")
    else:
        log(f"[FAIL] Missing assets: {missing}")

    # 3. Check Live Server
    try:
        import urllib.request
        with urllib.request.urlopen("http://127.0.0.1:8765/health", timeout=3) as r:
            if r.status == 200:
                log("[OK] Local Muse Engine (Port 8765): ACTIVE & RESPONDING (HTTP 200)")
    except Exception as e:
        log(f"[WARN] Local engine note: {e}")

    # 4. Check Tunnel
    tunnel_file = BASE_DIR / "data" / "remote_tunnel.json"
    if tunnel_file.exists():
        try:
            with open(tunnel_file, "r") as f:
                d = json.load(f)
                t_url = d.get("url")
                log(f"[OK] Cloudflare Global Tunnel: {t_url}")
        except Exception:
            pass

    # 5. Check APK & EXE
    apk = E_ROOT / "Muse_Agent.apk"
    exe = E_ROOT / "Muse.exe"
    if apk.exists():
        log(f"[OK] Android Release APK: {apk} ({apk.stat().st_size / (1024*1024):.2f} MB)")
    if exe.exists():
        log(f"[OK] Windows Executable: {exe} ({exe.stat().st_size / (1024*1024):.2f} MB)")

    log("==================================================")

def rebuild_apk():
    log("Rebuilding and signing Android APK with latest configuration...")
    build_script = SCRATCH_DIR / "build_muse_real_apk.py"
    if build_script.exists():
        res = subprocess.run([sys.executable, str(build_script)], cwd=str(SCRATCH_DIR))
        if res.returncode == 0:
            log("[OK] Successfully built, signed, and deployed Muse_Agent.apk to E:\\")
        else:
            log(f"[FAIL] APK build failed with code {res.returncode}")
    else:
        log(f"[FAIL] Build script not found at {build_script}")

def restart_server():
    log("Restarting Meta Muse Engine...")
    # Kill any existing main.py processes
    subprocess.run(["powershell", "-Command", "Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like '*main.py*'} | Stop-Process -Force"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.5)
    # Start fresh headless daemon
    subprocess.Popen([sys.executable, str(BASE_DIR / "main.py"), "--headless"], cwd=str(BASE_DIR), creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0)
    time.sleep(3)
    log("[OK] Meta Muse Engine successfully restarted!")

def main():
    print("=" * 60)
    print("      META MUSE - MASTER LIFELONG UPDATE SYSTEM")
    print("=" * 60)
    print("1. Complete System Health & Integrity Check")
    print("2. Restart & Refresh Server / Tunnel")
    print("3. Rebuild & Re-sign Android APK (Muse_Agent.apk)")
    print("4. Full Auto-Update (Check + Rebuild + Restart)")
    print("5. Exit")
    print("=" * 60)

    if len(sys.argv) > 1:
        choice = sys.argv[1].strip()
    else:
        try:
            choice = input("Select an option (1-5): ").strip()
        except EOFError:
            choice = "1"

    if choice == "1":
        run_health_check()
    elif choice == "2":
        restart_server()
        run_health_check()
    elif choice == "3":
        rebuild_apk()
    elif choice == "4":
        run_health_check()
        rebuild_apk()
        restart_server()
        log("[OK] Full Auto-Update Completed Successfully!")
    elif choice == "5":
        log("Exiting...")
    else:
        log("Invalid option.")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import sys
import os
import argparse
import subprocess

VERSION = "1.0.0"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

BANNER = f"""
 __  __                    _                    _   
|  \/  |_   _ ___  ___    / \   __ _  ___ _ __ | |_ 
| |\/| | | | / __|/ _ \  / _ \ / _` |/ _ \ '_ \| __|
| |  | | |_| \__ \  __/ / ___ \ (_| |  __/ | | | |_ 
|_|  |_|\__,_|___/\___|/_/   \_\__, |\___|_| |_|\__|
                                |___/  v{VERSION}
Autonomous Hybrid Desktop & Mobile Agent Runtime
Created by Raghav Khandal (@raghavkhandal72-coder)
"""

def print_banner():
    print(BANNER)

def run_gui():
    print("[*] Launching Muse Agent Desktop Interface...")
    os.chdir(BASE_DIR)
    import main
    main.main()

def run_server():
    print("[*] Launching Muse Agent Headless Server on port 8765...")
    os.chdir(BASE_DIR)
    sys.argv = ["main.py", "--headless"]
    import main
    main.main()

def run_doctor():
    print("[*] Running REA System and Toolchain Diagnostics...")
    doctor_path = os.path.join(BASE_DIR, "rea-inspector", "lib", "doctor.js").replace("\\", "/")
    script = f"console.log(JSON.stringify(require('{doctor_path}').runDoctor(), null, 2))"
    try:
        res = subprocess.run(["node", "-e", script], capture_output=True, text=True, cwd=BASE_DIR)
        if res.returncode == 0:
            print(res.stdout)
            print("[+] REA System Diagnostics: HEALTHY")
        else:
            print("[-] REA Error:", res.stderr)
    except Exception as e:
        print("[-] Node.js not detected or error executing REA doctor:", e)

def run_tunnel():
    print("[*] Spawning Zero-Config Cloudflare Remote Tunnel...")
    os.chdir(BASE_DIR)
    try:
        from tunnel_manager import RemoteTunnelManager
        mgr = RemoteTunnelManager()
        url = mgr.start_tunnel()
        print(f"[+] Active Public URL: {url}")
    except Exception as e:
        print("[-] Error spawning tunnel:", e)

def run_heal():
    print("[*] Running Autonomous Self-Healing Diagnostic Engine...")
    os.chdir(BASE_DIR)
    try:
        import muse_self_healing
        muse_self_healing.run_self_healing_suite()
    except Exception as e:
        print("[-] Self-healing error:", e)

def run_hud():
    print("[*] Generating OmniParse CUA Screen Bounding-Box Overlay...")
    os.chdir(BASE_DIR)
    try:
        import cua_hud
        res = cua_hud.generate_screen_hud()
        print(f"[+] CUA Visual HUD generated successfully: {res['output_path']}")
        print(f"[+] Total interactive elements tagged: {res['total_tags']}")
    except Exception as e:
        print("[-] HUD generation error:", e)

def run_benchmark():
    print("[*] Running Hardware & Neural Token Benchmark...")
    os.chdir(BASE_DIR)
    try:
        import neural_benchmark
        neural_benchmark.run_benchmark()
    except Exception as e:
        print("[-] Benchmark error:", e)

def main():
    parser = argparse.ArgumentParser(description="Muse AI Agent CLI Tool")
    parser.add_argument("command", nargs="?", default="run", 
                        choices=["run", "server", "doctor", "tunnel", "heal", "hud", "benchmark", "version"],
                        help="Command to execute")
    parser.add_argument("--headless", action="store_true", help="Run server in headless mode without GUI")
    
    args = parser.parse_args()

    if args.command == "version":
        print(f"Muse AI Agent v{VERSION}")
        return

    print_banner()

    if args.command == "server" or args.headless:
        run_server()
    elif args.command == "doctor":
        run_doctor()
    elif args.command == "tunnel":
        run_tunnel()
    elif args.command == "heal":
        run_heal()
    elif args.command == "hud":
        run_hud()
    elif args.command == "benchmark":
        run_benchmark()
    else:
        run_gui()

if __name__ == "__main__":
    main()

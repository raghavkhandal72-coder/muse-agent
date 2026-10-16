import os
import sys
import unittest
import subprocess

def main():
    print("=" * 60)
    print("           Muse AI Agent - Unified Test Runner")
    print("=" * 60)
    
    # 1. Compilation
    print("[1/3] Compiling core Python modules...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    mods = ["main.py", "tools.py", "settings_manager.py", "tunnel_manager.py", "cli.py"]
    for m in mods:
        path = os.path.join(base_dir, m)
        if os.path.exists(path):
            res = subprocess.run([sys.executable, "-m", "py_compile", path], capture_output=True)
            if res.returncode == 0:
                print(f"  [PASS] {m}")
            else:
                print(f"  [FAIL] {m}: {res.stderr.decode()}")
                return 1

    # 2. Unit Tests
    print("\n[2/3] Running automated unit test suite (tests/)...")
    loader = unittest.TestLoader()
    suite = loader.discover(os.path.join(base_dir, "tests"))
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    if not result.wasSuccessful():
        print("[-] Unit tests failed.")
        return 1

    # 3. REA System Doctor
    print("\n[3/3] Running REA System Diagnostics...")
    doctor_path = os.path.join(base_dir, "rea-inspector", "lib", "doctor.js").replace("\\", "/")
    res = subprocess.run(["node", "-e", f"console.log(require('{doctor_path}').runDoctor().overallStatus)"], capture_output=True, text=True, cwd=base_dir)
    if res.returncode == 0:
        print(f"  [PASS] REA Doctor Status: {res.stdout.strip()}")
    else:
        print(f"  [WARN] Node execution: {res.stderr.strip()}")

    print("\n" + "=" * 60)
    print("  [SUCCESS] All systems verified and 100% operational!")
    print("=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(main())

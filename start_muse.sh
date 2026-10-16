#!/usr/bin/env bash
# Muse AI Agent Launcher for Linux & macOS
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================================"
echo "              Muse AI Agent (muse-agent)"
echo "     Autonomous Hybrid Desktop & Mobile Runtime"
echo "========================================================"

# Find Python 3
if command -v python3 &>/dev/null; then
    PY_CMD="python3"
elif command -v python &>/dev/null; then
    PY_CMD="python"
else
    echo "[-] Python 3 is required. Please install Python 3.10+."
    exit 1
fi

echo "[*] Using Python: $($PY_CMD --version)"

# Check requirements
if [ -f "requirements.txt" ]; then
    echo "[*] Ensuring dependencies are installed..."
    $PY_CMD -m pip install -q -r requirements.txt || true
fi

echo "[*] Starting Muse Agent Server..."
$PY_CMD main.py

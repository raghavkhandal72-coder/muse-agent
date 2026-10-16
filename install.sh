#!/usr/bin/env bash
# Muse Agent - Linux/macOS 1-Line Universal Installer
# Created by Raghav Khandal (@raghavkhandal72-coder)

set -e

echo -e "[1;36m============================================================[0m"
echo -e "[1;33m         Muse AI Agent - Universal POSIX Installer          [0m"
echo -e "[1;36m============================================================[0m"

if ! command -v python3 &> /dev/null; then
    echo -e "[1;31m[ERROR] Python 3.10+ is required but not found.[0m"
    exit 1
fi

INSTALL_DIR="$HOME/muse-agent"
if [ ! -d "$INSTALL_DIR" ]; then
    echo -e "[1;32m[1/4] Cloning Muse Agent repository...[0m"
    git clone https://github.com/raghavkhandal72-coder/muse-agent.git "$INSTALL_DIR"
else
    echo -e "[1;32m[1/4] Updating existing Muse Agent in $INSTALL_DIR...[0m"
    git -C "$INSTALL_DIR" pull origin main
fi

cd "$INSTALL_DIR"
echo -e "[1;32m[2/4] Setting up Python virtual environment...[0m"
python3 -m venv venv
source venv/bin/activate

echo -e "[1;32m[3/4] Installing dependencies...[0m"
pip install --upgrade pip
pip install -r requirements.txt
pip install -e .

echo -e "[1;32m[4/4] Verifying system with test runner...[0m"
python scripts/test_runner.py

echo -e "[1;36m============================================================[0m"
echo -e "[1;32m  [SUCCESS] Muse Agent installed successfully![0m"
echo -e "[1;33m  To start Muse Agent, run:[0m"
echo -e "    cd $INSTALL_DIR && source venv/bin/activate && muse run"
echo -e "[1;36m============================================================[0m"

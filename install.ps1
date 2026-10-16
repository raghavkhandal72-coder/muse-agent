# Muse Agent - Windows 1-Line Universal Installer
# Created by Raghav Khandal (@raghavkhandal72-coder)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         Muse AI Agent - Universal Windows Installer        " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "[ERROR] Python 3.10+ is required but not found in PATH." -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/downloads/ and check 'Add Python to PATH'."
    exit 1
}

$installDir = "$HOME\muse-agent"
if (-not (Test-Path $installDir)) {
    Write-Host "[1/4] Cloning Muse Agent repository..." -ForegroundColor Green
    git clone https://github.com/raghavkhandal72-coder/muse-agent.git $installDir
} else {
    Write-Host "[1/4] Updating existing Muse Agent in $installDir..." -ForegroundColor Green
    git -C $installDir pull origin main
}

Write-Host "[2/4] Setting up Python virtual environment..." -ForegroundColor Green
Set-Location $installDir
python -m venv venv
$venvPython = "$installDir\venv\Scripts\python.exe"

Write-Host "[3/4] Installing dependencies and CLI..." -ForegroundColor Green
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r requirements.txt
& $venvPython -m pip install -e .

Write-Host "[4/4] Verifying installation with test runner..." -ForegroundColor Green
& $venvPython scripts/test_runner.py

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  [SUCCESS] Muse Agent installed successfully!" -ForegroundColor Green
Write-Host "  To start Muse Agent, run:" -ForegroundColor Yellow
Write-Host "    cd $installDir; .\venv\Scripts\activate; muse run" -ForegroundColor White
Write-Host "  Or double-click: $installDir\Start_Muse.bat" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

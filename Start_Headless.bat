@echo off
setlocal enabledelayedexpansion
title Meta Muse AI Agent (Headless Server)
echo ========================================================
echo        Meta Muse AI Desktop & Mobile Server
echo ========================================================
echo.

cd /d "%~dp0"

netstat -ano | findstr :8765 >nul
if %errorlevel% equ 0 (
    echo [Meta Muse] Agent server is already running on port 8765.
    echo Accessible at http://127.0.0.1:8765 and on LAN network.
    pause
    exit /b 0
)

set "PY_CMD="
where python >nul 2>&1
if %errorlevel% equ 0 (
    set "PY_CMD=python"
) else if exist "C:\Program Files\Python311\python.exe" (
    set "PY_CMD=C:\Program Files\Python311\python.exe"
)

if "%PY_CMD%"=="" (
    echo [ERROR] Python not found in PATH!
    pause
    exit /b 1
)

echo [Meta Muse] Starting Headless Server on port 8765...
"!PY_CMD!" "%~dp0main.py" --headless
pause

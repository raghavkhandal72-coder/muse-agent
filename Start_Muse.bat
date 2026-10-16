@echo off
setlocal enabledelayedexpansion
title Meta Muse AI Agent Launcher
echo ========================================================
echo               Meta Muse AI Desktop Agent
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Check if Muse Agent is already running on port 8765
netstat -ano | findstr :8765 >nul
if %errorlevel% equ 0 (
    echo [Meta Muse] Agent server is already running on port 8765.
    goto launch_ui
)

:: 2. Find Python executable
set "PY_CMD="
where python >nul 2>&1
if %errorlevel% equ 0 (
    set "PY_CMD=python"
) else if exist "C:\Program Files\Python311\python.exe" (
    set "PY_CMD=C:\Program Files\Python311\python.exe"
) else if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set "PY_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
) else if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    set "PY_CMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
)

if "%PY_CMD%"=="" (
    if exist "%~dp0Muse.exe" (
        echo [Meta Muse] Python not found, launching compiled Muse.exe...
        start "" "%~dp0Muse.exe"
        goto wait_and_open
    )
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

echo [Meta Muse] Starting backend engine with !PY_CMD!...
start /B "" "!PY_CMD!" "%~dp0main.py"

:wait_and_open
echo [Meta Muse] Waiting for agent engine to initialize...
set /a count=0
:check_loop
timeout /t 1 /nobreak >nul
netstat -ano | findstr :8765 >nul
if %errorlevel% equ 0 goto launch_ui
set /a count+=1
if !count! lss 10 goto check_loop

:launch_ui
echo [Meta Muse] Agent server ready! Opening desktop workspace...

:: Try Chrome App mode
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://127.0.0.1:8765 --window-size=1280,850
    goto finish
)

:: Try Edge App mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://127.0.0.1:8765 --window-size=1280,850
    goto finish
)

:: Browser fallback
start http://127.0.0.1:8765

:finish
echo.
echo [Meta Muse] Workspace running at http://127.0.0.1:8765
echo Close this window or press any key to exit launcher.
timeout /t 3 /nobreak >nul
exit /b 0

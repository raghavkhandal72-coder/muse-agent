@echo off
title Meta Muse - 1-Click APK Auto Updater
cls
echo ======================================================================
echo              META MUSE - 1-COMMAND APK AUTO UPDATER
echo ======================================================================
echo [*] Checking Python environment...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found in PATH! Please install Python 3.
    pause
    exit /b 1
)

echo [*] Synchronizing latest UI, Connectors & Engine into APKs...
if exist "%~dp0update_apk.py" (
    python "%~dp0update_apk.py"
) else if exist "%~dp0muse\update_apk.py" (
    python "%~dp0muse\update_apk.py"
) else (
    python "C:\Users\dell\.gemini\antigravity-ide\scratch\update_apk.py"
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo [SUCCESS] APK Update Completed! Both APKs are 100%% up to date.
    echo ======================================================================
) else (
    echo.
    echo [ERROR] Failed to update APK. Check output above.
)
echo.
pause

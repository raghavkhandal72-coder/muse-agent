@echo off
title Open Dots AI Coding Suite
echo ======================================================================
echo           OPEN DOTS - AUTONOMOUS AI CODING AGENT SUITE
echo               Cloned and Integrated from Anil-matcha/open-dots
echo ======================================================================
echo.
echo [INFO] Location: %~dp0open-dots
echo [INFO] Backend:  Python FastAPI (uvicorn app.main:app)
echo [INFO] Frontend: Next.js TypeScript
echo.
echo Launching Open Dots Backend...
cd /d "%~dp0open-dots\backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
if %errorlevel% neq 0 (
    echo.
    echo [TIP] To install backend dependencies: pip install fastapi uvicorn
    echo Or run through uv: uv run uvicorn app.main:app --port 8000
    pause
)

@echo off
title LibreChat AI Interface
echo ======================================================================
echo             LIBRECHAT - ENHANCED CHAT & AI AGENT PLATFORM
echo               Integrated from LibreChat-AI/LibreChat
echo ======================================================================
echo.
echo [INFO] Location: C:\Users\dell\.gemini\antigravity-ide\scratch\LibreChat
echo [INFO] API Backend: Node.js / Express (api)
echo [INFO] Client UI:   React / Vite / Tailwind (client)
echo.
cd /d "C:\Users\dell\.gemini\antigravity-ide\scratch\LibreChat"
echo Checking npm environment...
if exist "package.json" (
    echo Starting LibreChat dev server...
    npm run backend
) else (
    echo [ERROR] LibreChat files not found at destination.
    pause
)
pause

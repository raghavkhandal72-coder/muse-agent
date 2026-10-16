@echo off
title Meta Muse Desktop Agent Windows Installer
echo ========================================================
echo          Installing Meta Muse Desktop Agent
echo ========================================================
echo.
set "INSTALL_DIR=%LOCALAPPDATA%\Programs\Muse"
echo Creating installation directory: %INSTALL_DIR%
mkdir "%INSTALL_DIR%" 2>nul

echo Copying binaries and resources...
if exist "%~dp0Muse.exe" copy /Y "%~dp0Muse.exe" "%INSTALL_DIR%\Muse.exe" >nul
if exist "%~dp0EndoCrashpadHandler.exe" copy /Y "%~dp0EndoCrashpadHandler.exe" "%INSTALL_DIR%\EndoCrashpadHandler.exe" >nul
if exist "%~dp0Updater.exe" copy /Y "%~dp0Updater.exe" "%INSTALL_DIR%\Updater.exe" >nul
if exist "%~dp0AppIcon.ico" copy /Y "%~dp0AppIcon.ico" "%INSTALL_DIR%\AppIcon.ico" >nul

echo Creating Desktop shortcut...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.Environment]::GetFolderPath('Desktop') + '\Meta Muse.lnk'); $s.TargetPath = '%INSTALL_DIR%\Muse.exe'; $s.IconLocation = '%INSTALL_DIR%\AppIcon.ico,0'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Save()"

echo Creating Start Menu shortcut...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $start = [System.Environment]::GetFolderPath('StartMenu') + '\Programs'; $s = $ws.CreateShortcut($start + '\Meta Muse.lnk'); $s.TargetPath = '%INSTALL_DIR%\Muse.exe'; $s.IconLocation = '%INSTALL_DIR%\AppIcon.ico,0'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Save()"

echo.
echo ========================================================
echo       Installation Completed Successfully!
echo       Launch from Desktop or Start Menu shortcut.
echo ========================================================
pause

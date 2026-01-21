@echo off
setlocal enabledelayedexpansion

REM ============================================
REM Restart DLSU Portal Application
REM ============================================

echo.
echo Restarting DLSU Portal application...
echo.

pm2 restart dlsu-portal

if %errorLevel% equ 0 (
    echo.
    echo [SUCCESS] Application restarted successfully.
    echo.
    pm2 list
) else (
    echo.
    echo [ERROR] Failed to restart application.
    echo [INFO] Attempting to start the application...
    pm2 start ecosystem.config.js
    pm2 save
    echo.
    pm2 list
)

echo.
pause


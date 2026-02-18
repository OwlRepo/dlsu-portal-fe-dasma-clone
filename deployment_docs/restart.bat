@echo off
setlocal enabledelayedexpansion

REM ============================================
REM Restart DLSU Portal Application
REM ============================================

echo.
echo Restarting DLSU Portal FE Dasma application...
echo.

pm2 restart dlsu-portal-fe-dasma

if %errorLevel% equ 0 (
    echo.
    echo [SUCCESS] Application restarted successfully.
    echo.
    pm2 list
) else (
    echo.
    echo [ERROR] Failed to restart application.
    echo [INFO] Attempting to start the application...
    pm2 start deployment_docs/ecosystem.config.js --env production
    pm2 save
    echo.
    pm2 list
)

echo.
pause


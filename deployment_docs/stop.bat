@echo off
setlocal enabledelayedexpansion

REM ============================================
REM Stop DLSU Portal Application
REM ============================================

echo.
echo Stopping DLSU Portal application...
echo.

pm2 stop dlsu-portal

if %errorLevel% equ 0 (
    echo.
    echo [SUCCESS] Application stopped successfully.
    echo.
    pm2 list
) else (
    echo.
    echo [ERROR] Failed to stop application.
    echo [INFO] The application may not be running.
    pm2 list
)

echo.
pause


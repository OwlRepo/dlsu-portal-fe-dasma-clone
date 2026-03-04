@echo off
setlocal enabledelayedexpansion
set PM2=npx --yes pm2

REM ============================================
REM Stop DLSU Portal Application
REM ============================================

echo.
echo Stopping DLSU Portal FE Dasma application...
echo.

%PM2% stop dlsu-portal-fe-dasma

if !errorLevel! equ 0 (
    echo.
    echo [SUCCESS] Application stopped successfully.
    echo.
    %PM2% list
) else (
    echo.
    echo [ERROR] Failed to stop application.
    echo [INFO] The application may not be running.
    %PM2% list
)

echo.
pause


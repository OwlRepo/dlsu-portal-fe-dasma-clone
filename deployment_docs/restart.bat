@echo off
setlocal enabledelayedexpansion
set PM2=npx --yes pm2

REM ============================================
REM Restart DLSU Portal Application
REM ============================================

cd /d "%~dp0\.."
set ECOSYSTEM=deployment_docs\ecosystem.config.js

echo.
echo Restarting DLSU Portal FE Dasma application...
echo.

%PM2% describe dlsu-portal-fe-dasma >nul 2>&1
if !errorLevel! equ 0 (
    %PM2% restart dlsu-portal-fe-dasma
    if !errorLevel! equ 0 (
        echo [SUCCESS] Application restarted successfully.
        %PM2% save >nul 2>&1
    ) else (
        echo [ERROR] PM2 restart failed.
    )
) else (
    echo [INFO] App not in PM2. Starting from ecosystem...
    %PM2% start "%ECOSYSTEM%" --env production
    if !errorLevel! equ 0 (
        echo [SUCCESS] Application started.
        %PM2% save >nul 2>&1
    ) else (
        echo [ERROR] Failed to start application.
    )
)

echo.
%PM2% list
echo.
pause


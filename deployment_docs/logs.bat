@echo off
setlocal enabledelayedexpansion
set PM2=npx --yes pm2

REM ============================================
REM View DLSU Portal Application Logs
REM ============================================

echo.
echo ============================================
echo DLSU Portal - Application Logs
echo ============================================
echo.
echo Press Ctrl+C to exit log viewer
echo.

%PM2% logs dlsu-portal-fe-dasma --lines 100


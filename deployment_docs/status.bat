@echo off
setlocal enabledelayedexpansion
set PM2=npx --yes pm2

REM ============================================
REM Check DLSU Portal Application Status
REM ============================================

echo.
echo ============================================
echo DLSU Portal - Application Status
echo ============================================
echo.

%PM2% list

echo.
echo ============================================
echo Detailed Information
echo ============================================
echo.

%PM2% describe dlsu-portal-fe-dasma

echo.
echo ============================================
echo Monitoring (Press Ctrl+C to exit)
echo ============================================
echo.

%PM2% monit


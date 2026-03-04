@echo off
setlocal enabledelayedexpansion
title DLSU Portal FE Dasma - PM2 Deploy

if "%~1"=="skip-lint" set SKIP_LINT_BUILD=1

set APP_NAME=dlsu-portal-fe-dasma
set APP_PORT=3000
set APP_URL=http://localhost:%APP_PORT%
set ECOSYSTEM=deployment_docs/ecosystem.config.js

cd /d "%~dp0\.."
set PROJECT_ROOT=%cd%

echo.
echo ========================================
echo   DLSU Portal FE Dasma - PM2 Deploy
echo ========================================
echo.

echo [1/8] Checking prerequisites...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
echo [OK] Node.js: !NODE_VERSION!

where bun >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Bun is not installed.
    echo Install Bun from: https://bun.sh/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('bun --version 2^>nul') do set BUN_VERSION=%%i
echo [OK] Bun: !BUN_VERSION!

where pm2 >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] PM2 not found. Installing globally...
    call npm install -g pm2 --loglevel=error
    if %errorLevel% neq 0 (
        echo [ERROR] Failed to install PM2 globally.
        pause
        exit /b 1
    )
)
echo [OK] PM2 ready

if not exist "%PROJECT_ROOT%\package.json" (
    echo [ERROR] package.json not found at %PROJECT_ROOT%
    pause
    exit /b 1
)
if not exist "%PROJECT_ROOT%\%ECOSYSTEM%" (
    echo [ERROR] Missing PM2 ecosystem file: %PROJECT_ROOT%\%ECOSYSTEM%
    pause
    exit /b 1
)
if not exist "%PROJECT_ROOT%\logs" mkdir "%PROJECT_ROOT%\logs"
echo [OK] Project files verified
echo.

echo [2/8] Installing dependencies with Bun...
call bun install --ignore-scripts
if %errorLevel% neq 0 (
    echo [WARNING] bun install had issues, retrying...
    call bun install --ignore-scripts
    if %errorLevel% neq 0 (
        echo [ERROR] bun install failed.
        pause
        exit /b 1
    )
)
echo [OK] Dependencies installed
echo.

echo [3/8] Building Next.js app with Bun...
if "!SKIP_LINT_BUILD!"=="1" (
    echo.
    echo [WARNING] SKIP_LINT_BUILD=1 - ESLint and TypeScript checks disabled for this build
    echo [WARNING] Use only for emergency deployment. Fix lint errors before next release.
    echo.
)
call bun run build
if !errorLevel! neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

echo [4/8] Stopping existing PM2 process (if running)...
set PM2_STEP_OK=0
pm2 ping >nul 2>&1
if !errorLevel! neq 0 (
    echo [INFO] PM2 daemon not running - no process to stop
    set PM2_STEP_OK=1
) else (
    pm2 describe %APP_NAME% >nul 2>&1
    if %errorLevel% equ 0 (
        echo   Stopping %APP_NAME%...
        pm2 stop %APP_NAME% 2>&1
        timeout /t 2 /nobreak >nul
        echo   Removing %APP_NAME% from PM2...
        pm2 delete %APP_NAME% 2>&1
        if !errorLevel! equ 0 (
            echo [OK] Previous instance removed
        ) else (
            echo [OK] Process removed or already gone - continuing
        )
        set PM2_STEP_OK=1
    ) else (
        echo [OK] No previous PM2 instance found
        set PM2_STEP_OK=1
    )
)
if !PM2_STEP_OK! neq 1 (
    echo [WARNING] PM2 step had issues - attempting to continue
)
echo.

echo [5/8] Starting app with PM2...
pm2 start "%ECOSYSTEM%" --env production
if %errorLevel% neq 0 (
    echo [ERROR] Failed to start PM2 app.
    echo Check logs with: pm2 logs %APP_NAME%
    pause
    exit /b 1
)
pm2 save >nul 2>&1
echo [OK] PM2 app started
echo.

echo [6/8] Configuring PM2 auto-start on Windows boot...
net session >nul 2>&1
set IS_ADMIN=%errorLevel%
if !IS_ADMIN! equ 0 (
    for /f "tokens=*" %%i in ('pm2 startup 2^>^&1') do (
        echo %%i | findstr /i "pm2" >nul
        if !errorLevel! equ 0 (
            call %%i >nul 2>&1
        )
    )
    pm2 save >nul 2>&1
    echo [OK] Startup configuration attempted as Administrator
) else (
    echo [INFO] Run as Administrator once, then execute:
    echo        pm2 startup
    echo        pm2 save
)
if exist "%USERPROFILE%\.pm2\dump.pm2" (
    echo [OK] PM2 dump file present
) else (
    echo [WARNING] PM2 dump file not found yet.
)
echo.

echo [7/8] Verifying app readiness...
set MAX_ATTEMPTS=30
set ATTEMPT=0
set READY=0

:wait_loop
set /a ATTEMPT+=1
echo   Attempt !ATTEMPT!/!MAX_ATTEMPTS! - Checking %APP_URL%...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%APP_URL%' -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorLevel% equ 0 (
    set READY=1
    goto :readiness_done
)
if !ATTEMPT! lss !MAX_ATTEMPTS! (
    timeout /t 2 /nobreak >nul
    goto :wait_loop
)

:readiness_done
if !READY! neq 1 (
    echo [ERROR] App did not become ready at %APP_URL%
    echo Check logs with: pm2 logs %APP_NAME%
    pause
    exit /b 1
)
echo [OK] App is reachable
echo.

echo [8/8] Deployment complete.
echo ========================================
echo   Deployment Successful
echo ========================================
pm2 status
echo.
echo Opening app in browser: %APP_URL%
start "" "%APP_URL%"
echo.
echo Useful commands:
echo   pm2 logs %APP_NAME%
echo   pm2 restart %APP_NAME%
echo   pm2 stop %APP_NAME%
echo.
pause
exit /b 0

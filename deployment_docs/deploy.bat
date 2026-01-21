@echo off
setlocal enabledelayedexpansion

REM ============================================
REM DLSU Portal - Windows Server Deployment Script
REM ============================================
REM This script automates the deployment of the Next.js application
REM on Windows Server without Docker.
REM ============================================

echo.
echo ============================================
echo DLSU Portal - Deployment Script
echo ============================================
echo.

REM Get the script directory and project root
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
cd /d "%PROJECT_ROOT%"

REM Check for administrative privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script requires administrative privileges.
    echo Please right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo [INFO] Administrative privileges confirmed.
echo.

REM ============================================
REM Step 1: Check and Install Node.js
REM ============================================
echo [STEP 1/7] Checking Node.js installation...

REM Set Node.js path variable
set "NODE_EXE="
if exist "%ProgramFiles%\nodejs\node.exe" (
    set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
    set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"
)

REM Check if node is available in PATH or via direct path
if defined NODE_EXE (
    "%NODE_EXE%" --version >nul 2>&1
    if %errorLevel% equ 0 (
        echo [INFO] Node.js is already installed.
        for /f "tokens=*" %%i in ('"%NODE_EXE%" --version') do set NODE_VERSION=%%i
        echo [INFO] Current version: !NODE_VERSION!
        set "NODE_CMD=%NODE_EXE%"
        goto :node_installed
    )
) else (
    node --version >nul 2>&1
    if %errorLevel% equ 0 (
        echo [INFO] Node.js is already installed.
        for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
        echo [INFO] Current version: !NODE_VERSION!
        set "NODE_CMD=node"
        goto :node_installed
    )
)

REM If we get here, Node.js is not installed
if not defined NODE_EXE (
    echo [INFO] Node.js not found. Installing Node.js v20 LTS...
    
    REM Create temp directory for installer
    set "TEMP_DIR=%TEMP%\dlsu-portal-deploy"
    if not exist "!TEMP_DIR!" mkdir "!TEMP_DIR!"
    
    set "NODE_INSTALLER=!TEMP_DIR!\nodejs-installer.msi"
    set "NODE_URL=https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
    
    echo [INFO] Downloading Node.js installer...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_INSTALLER%'}"
    
    if not exist "!NODE_INSTALLER!" (
        echo [ERROR] Failed to download Node.js installer.
        echo [ERROR] Please check your internet connection and try again.
        pause
        exit /b 1
    )
    
    echo [INFO] Installing Node.js (this may take a few minutes)...
    msiexec /i "!NODE_INSTALLER!" /quiet /norestart ADDLOCAL=ALL
    
    REM Wait a moment for installation to complete
    timeout /t 15 /nobreak >nul
    
    REM Refresh PATH environment variable by reading from registry
    for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "SYSTEM_PATH=%%B"
    set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;!SYSTEM_PATH!"
    
    REM Verify installation by checking if node.exe exists
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "PATH=%ProgramFiles%\nodejs;!SYSTEM_PATH!"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "PATH=%ProgramFiles(x86)%\nodejs;!SYSTEM_PATH!"
    )
    
    REM Verify installation
    set "NODE_EXE="
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"
    )
    
    if not defined NODE_EXE (
        echo [ERROR] Node.js installation completed but node.exe not found.
        echo [ERROR] The installation may require a system restart.
        echo [ERROR] Please restart your command prompt and run this script again.
        pause
        exit /b 1
    )
    
    "%NODE_EXE%" --version >nul 2>&1
    if %errorLevel% neq 0 (
        echo [ERROR] Node.js installation completed but verification failed.
        echo [ERROR] Please restart your command prompt and run this script again.
        pause
        exit /b 1
    )
    
    set "NODE_CMD=%NODE_EXE%"
    echo [SUCCESS] Node.js installed successfully.
    for /f "tokens=*" %%i in ('"%NODE_EXE%" --version') do echo [INFO] Installed version: %%i
    
    REM Cleanup installer
    del /q "!NODE_INSTALLER!" >nul 2>&1
)

:node_installed
REM Ensure NODE_CMD is set for subsequent commands
if not defined NODE_CMD (
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "NODE_CMD=%ProgramFiles%\nodejs\node.exe"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "NODE_CMD=%ProgramFiles(x86)%\nodejs\node.exe"
    ) else (
        set "NODE_CMD=node"
    )
)

echo.

REM ============================================
REM Step 2: Verify npm is available
REM ============================================
echo [STEP 2/7] Verifying npm installation...

npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] npm is not available. Node.js installation may be incomplete.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [INFO] npm version: !NPM_VERSION!
echo.

REM ============================================
REM Step 3: Install Project Dependencies
REM ============================================
echo [STEP 3/7] Installing project dependencies...
echo [INFO] This may take several minutes...

call npm install
if %errorLevel% neq 0 (
    echo [ERROR] Failed to install project dependencies.
    echo [ERROR] Please check your internet connection and try again.
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed successfully.
echo.

REM ============================================
REM Step 4: Build the Application
REM ============================================
echo [STEP 4/7] Building the Next.js application...
echo [INFO] This may take several minutes...

call npm run build
if %errorLevel% neq 0 (
    echo [ERROR] Build failed. Please check the error messages above.
    pause
    exit /b 1
)

echo [SUCCESS] Application built successfully.
echo.

REM ============================================
REM Step 5: Install PM2 Globally
REM ============================================
echo [STEP 5/7] Installing PM2 globally...

npm list -g pm2 >nul 2>&1
if %errorLevel% equ 0 (
    echo [INFO] PM2 is already installed globally.
) else (
    echo [INFO] Installing PM2...
    call npm install -g pm2
    
    if %errorLevel% neq 0 (
        echo [ERROR] Failed to install PM2 globally.
        pause
        exit /b 1
    )
    
    echo [SUCCESS] PM2 installed successfully.
)

REM Verify PM2 installation
pm2 --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] PM2 installation verification failed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('pm2 --version') do echo [INFO] PM2 version: %%i
echo.

REM ============================================
REM Step 6: Setup PM2 Ecosystem Configuration
REM ============================================
echo [STEP 6/7] Setting up PM2 ecosystem configuration...

REM Copy ecosystem.config.js from deployment_docs to project root
if exist "%SCRIPT_DIR%ecosystem.config.js" (
    copy /Y "%SCRIPT_DIR%ecosystem.config.js" "%PROJECT_ROOT%\ecosystem.config.js" >nul
    echo [INFO] PM2 ecosystem configuration file copied to project root.
) else (
    echo [WARNING] ecosystem.config.js not found in deployment_docs folder.
    echo [WARNING] Creating default ecosystem.config.js...
    
    (
        echo module.exports = {
        echo   apps: [{
        echo     name: 'dlsu-portal',
        echo     script: 'npm',
        echo     args: 'start',
        echo     cwd: '%PROJECT_ROOT:\=/%',
        echo     instances: 1,
        echo     exec_mode: 'fork',
        echo     autorestart: true,
        echo     watch: false,
        echo     max_memory_restart: '1G',
        echo     env: {
        echo       NODE_ENV: 'production',
        echo       PORT: 3000
        echo     },
        echo     error_file: './logs/pm2-error.log',
        echo     out_file: './logs/pm2-out.log',
        echo     log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
        echo   }]
        echo };
    ) > "%PROJECT_ROOT%\ecosystem.config.js"
    
    echo [INFO] Default ecosystem.config.js created.
)

REM Create logs directory if it doesn't exist
if not exist "%PROJECT_ROOT%\logs" mkdir "%PROJECT_ROOT%\logs"

echo.

REM ============================================
REM Step 7: Deploy Application with PM2
REM ============================================
echo [STEP 7/7] Deploying application with PM2...

REM Stop existing instance if running
pm2 stop dlsu-portal >nul 2>&1
pm2 delete dlsu-portal >nul 2>&1

REM Start the application
echo [INFO] Starting application with PM2...
pm2 start ecosystem.config.js

if %errorLevel% neq 0 (
    echo [ERROR] Failed to start application with PM2.
    pause
    exit /b 1
)

REM Save PM2 process list
pm2 save

echo [SUCCESS] Application started successfully with PM2.
echo.

REM ============================================
REM Step 8: Configure Windows Startup
REM ============================================
echo [BONUS] Configuring Windows startup...

REM Check if PM2 startup is already configured
pm2 startup >nul 2>&1
if %errorLevel% equ 0 (
    echo [INFO] PM2 startup is already configured.
) else (
    echo [INFO] Setting up PM2 Windows startup...
    echo [INFO] Please run the command shown below as administrator:
    echo.
    pm2 startup
    echo.
    echo [INFO] After running the command above, execute: pm2 save
)

echo.

REM ============================================
REM Deployment Complete
REM ============================================
echo ============================================
echo Deployment Complete!
echo ============================================
echo.
echo Application Status:
pm2 list
echo.
echo Useful commands:
echo   - View logs: pm2 logs dlsu-portal
echo   - Restart: pm2 restart dlsu-portal
echo   - Stop: pm2 stop dlsu-portal
echo   - Status: pm2 status
echo.
echo The application should be accessible at: http://localhost:3000
echo.
echo For more information, see DEPLOYMENT_GUIDE.md
echo.
pause


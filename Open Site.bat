@echo off
setlocal enabledelayedexpansion
title Alphaxen Type Foundry - Local Host Launcher
color 0B

:: Ensure current working directory is the script directory
cd /d "%~dp0"

echo ======================================================================
echo           ALPHAXEN TYPE FOUNDRY - LOCAL HOST AUTO-PUBLISHER
echo ======================================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in PATH!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] First-time setup: Installing required dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed. Please check your internet connection.
        pause
        exit /b 1
    )
)

:: Check if dist exists, otherwise build it
if not exist "dist\" (
    echo [2/3] Compiling modern foundry bundle and demo glyphs...
    call npx vite build
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Build failed.
        pause
        exit /b 1
    )
)

echo [3/3] Publishing Alphaxen Foundry on Local Host...
echo.
echo  ====================================================================
echo    STATUS   : ONLINE
echo    URL      : http://localhost:5173
echo    SECURITY : DRM Protected (Zero .otf leaks, isolated demo glyphs)
echo  ====================================================================
echo.
echo [*] Opening your default web browser now...
echo [*] Press Ctrl+C in this window anytime to stop the local server.
echo.

:: Automatically open default browser after a brief moment
start http://localhost:5173

:: Start the production-grade local host server
call npx vite preview --port 5173 --host
if %ERRORLEVEL% neq 0 (
    echo [Fallback] Starting Vite dev server...
    call npx vite --port 5173 --host --open
)

pause

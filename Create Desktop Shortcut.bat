@echo off
title Create Desktop Shortcut - Alphaxen Foundry
cd /d "%~dp0"

echo Creating Desktop Shortcut for Alphaxen Foundry Launcher...
python scripts/create_shortcut.py

echo.
pause

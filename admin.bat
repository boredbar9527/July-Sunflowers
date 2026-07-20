@echo off
rem July Sunflowers - Catalog Admin launcher.
rem Double-click this file to open the catalog admin in your browser.
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Please install it from https://nodejs.org first.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run: installing dependencies, please wait...
  call npm install
)

echo Starting catalog admin... your browser will open shortly.
echo Keep this window open while using the admin. Close it when you are done.
call npm run admin -- --open
pause

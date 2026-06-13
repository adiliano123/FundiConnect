@echo off
title FundiConnect Backend
color 0A

echo ================================================
echo   FundiConnect Backend Startup
echo ================================================
echo.

cd /d "%~dp0backend"

echo [1/3] Clearing config cache...
php artisan config:clear
php artisan cache:clear

echo.
echo [2/3] Starting Queue Worker (background)...
start "FundiConnect Queue Worker" cmd /k "php artisan queue:work --tries=3 --timeout=60 --queue=default"

echo.
echo [3/3] Starting Scheduler (background)...
start "FundiConnect Scheduler" cmd /k "php artisan schedule:work"

echo.
echo [4/4] Starting Laravel Server on http://localhost:8000 ...
echo.
php artisan serve --host=127.0.0.1 --port=8000

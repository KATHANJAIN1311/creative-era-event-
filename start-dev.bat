@echo off
echo ========================================
echo Creative Era Events - Startup Script
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd server
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Client...
cd ..\client
start "Frontend Client" cmd /k "npm start"

echo.
echo ========================================
echo Both servers are starting...
echo Backend: http://localhost:3003
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul

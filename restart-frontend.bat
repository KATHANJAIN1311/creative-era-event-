@echo off
echo ========================================
echo Restarting Frontend with New Config
echo ========================================
echo.
echo Stopping any running frontend processes...
taskkill /F /FI "WINDOWTITLE eq Frontend Client*" 2>nul
timeout /t 2 /nobreak >nul

echo Starting frontend with updated configuration...
cd client
start "Frontend Client" cmd /k "npm start"

echo.
echo ========================================
echo Frontend restarted!
echo URL: http://localhost:3000
echo API: http://localhost:3003
echo ========================================

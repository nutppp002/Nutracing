@echo off
title MotoFix Shop Management System
echo ==============================================
echo        Starting MotoFix System...
echo ==============================================
echo.
echo Please wait while the system is starting up.
echo The browser will open automatically.
echo (Do not close this window while using the system)
echo.

cd /d "%~dp0"
echo กำลังเริ่มระบบ MotoFix Host...
start MotoFixHost.exe
echo ระบบเปิดใช้งานแล้ว
pause

@echo off
title MotoFix System Uninstaller
echo ============================================================
echo         MotoFix Shop Management System - Uninstaller
echo ============================================================
echo.

:: Check for administrative rights
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [ERROR] Please run this file as Administrator!
    echo Right-click on Uninstall_MotoFix.bat and select "Run as administrator"
    pause
    exit /b 1
)

echo [1/3] Closing MotoFix System...
taskkill /F /IM MotoFixHost.exe >nul 2>&1

echo [2/3] Removing Firewall Rules...
netsh advfirewall firewall delete rule name="MotoFix Host (Port 3000)" >nul 2>&1

echo [3/3] Removing System Files and Desktop Shortcut...
set "INSTALL_DIR=C:\MotoFixSystem"
if exist "%INSTALL_DIR%\MotoFixHost.exe" del /F /Q "%INSTALL_DIR%\MotoFixHost.exe"
if exist "%USERPROFILE%\Desktop\MotoFix Shop System.lnk" del /F /Q "%USERPROFILE%\Desktop\MotoFix Shop System.lnk"
if exist "%PUBLIC%\Desktop\MotoFix Shop System.lnk" del /F /Q "%PUBLIC%\Desktop\MotoFix Shop System.lnk"

echo.
echo ============================================================
echo  Uninstallation Successful!
echo ============================================================
echo.
echo Note: Your database file (motofix_data.json) is kept at %INSTALL_DIR%
echo to prevent data loss. If you want to delete everything, you can delete this folder manually.
echo.
pause

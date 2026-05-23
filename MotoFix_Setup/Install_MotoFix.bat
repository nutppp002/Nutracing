@echo off
title MotoFix System Installer
echo ============================================================
echo         MotoFix Shop Management System - Installer
echo ============================================================
echo.

:: Check for administrative rights
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [ERROR] Please run this file as Administrator!
    echo Right-click on Install_MotoFix.bat and select "Run as administrator"
    pause
    exit /b 1
)

set "INSTALL_DIR=C:\MotoFixSystem"

echo [1/4] Creating system folder at %INSTALL_DIR%...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [2/4] Copying system files to %INSTALL_DIR%...
if not exist "%~dp0MotoFixHost.exe" (
    echo [ERROR] MotoFixHost.exe not found! Please extract all files.
    pause
    exit /b 1
)
taskkill /F /IM MotoFixHost.exe >nul 2>&1
copy /Y "%~dp0MotoFixHost.exe" "%INSTALL_DIR%\MotoFixHost.exe" >nul

echo [3/4] Configuring Windows Firewall (Port 3000)...
netsh advfirewall firewall delete rule name="MotoFix Host (Port 3000)" >nul 2>&1
netsh advfirewall firewall add rule name="MotoFix Host (Port 3000)" dir=in action=allow protocol=TCP localport=3000 >nul

echo [4/4] Creating Desktop Shortcut...
set "SCRIPT=%TEMP%\CreateShortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%SCRIPT%"
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\MotoFix Shop System.lnk" >> "%SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SCRIPT%"
echo oLink.TargetPath = "%INSTALL_DIR%\MotoFixHost.exe" >> "%SCRIPT%"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%SCRIPT%"
echo oLink.Description = "MotoFix Shop Management System" >> "%SCRIPT%"
echo oLink.Save >> "%SCRIPT%"
cscript /nologo "%SCRIPT%"
del "%SCRIPT%"

echo.
echo ============================================================
echo  Installation Successful!
echo ============================================================
echo.
echo You can now open the system from the "MotoFix Shop System" shortcut on your Desktop.
echo.
pause

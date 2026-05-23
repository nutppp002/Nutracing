@echo off
chcp 65001 > nul
title MotoFix Host Setup and Firewall Configuration
echo ============================================================
echo   MotoFix Setup - Firewall Configuration for Host Machine
echo ============================================================
echo.
echo ขอสิทธิ์ Administrator เพื่อตั้งค่าเปิด Port 80
echo.

:: Check for administrative rights
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Administrator privileges detected.
) else (
    echo [ERROR] กรุณารันไฟล์นี้ด้วยสิทธิ์ Administrator!
    echo ให้คลิกขวาที่ไฟล์นี้ แล้วเลือก "Run as administrator"
    pause
    exit /b 1
)

:: Add Firewall rule for port 80
echo กำลังเพิ่มกฎ Firewall สำหรับ MotoFix (Port 80)...
netsh advfirewall firewall add rule name="MotoFix Host (Port 80)" dir=in action=allow protocol=TCP localport=80 >nul 2>&1

if %errorLevel% == 0 (
    echo [OK] ตั้งค่า Firewall สำเร็จ! เครื่องอื่นสามารถเชื่อมต่อได้แล้ว
) else (
    echo [WARNING] ไม่สามารถตั้งค่า Firewall ได้ (อาจจะเคยตั้งค่าไว้แล้ว)
)

echo.
echo กำลังเปิดระบบ MotoFix Host...
echo.
start MotoFixHost.exe

echo [INFO] ระบบเปิดใช้งานแล้ว สามารถปิดหน้าต่างนี้ได้เลย
pause

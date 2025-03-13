@echo off
if not exist "index.mjs" (
    echo. > index.mjs
)

echo updating...
certutil -urlcache -split -f "https://cdn.jsdelivr.net/gh/rquanx/suning-delivery-automatic@main/dist/index.mjs" index.mjs >nul

if %errorlevel% equ 0 (
    echo Update success
) else (
    echo Update failed, please check your network
)
echo.
echo Press any key to exit...
pause >nul
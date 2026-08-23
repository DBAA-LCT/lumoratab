@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0preview-edge-dev.ps1"
if errorlevel 1 pause
exit /b %errorlevel%

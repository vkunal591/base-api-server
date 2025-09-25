@echo off
SETLOCAL ENABLEEXTENSIONS

:: === Set your Next.js project path ===
SET "PROJECT_PATH=C:\Users\Rana Durgesh\base-api-server"

:: === Navigate to the project folder ===
cd /d "%PROJECT_PATH%" || (
    echo ❌ Invalid project path! Please check the path.
    pause
    exit /b
)

:: === Launch the Next.js server in a minimized command window ===
start "Next.js Server" /min cmd /c "npm run start"

:: === Wait for the server to start ===
timeout /t 10 /nobreak >nul

:: === Set your local URL ===
SET "URL=http://localhost:3000"

:: === Try to find Microsoft Edge path ===
SET "EDGE_PATH="
for %%I in (
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) do (
    if exist %%~I (
        SET "EDGE_PATH=%%~I"
    )
)

:: === Fallback if Edge not found ===
if not defined EDGE_PATH (
    echo ❌ Microsoft Edge not found!
    pause
    exit /b
)

:: === Launch Edge in App mode and wait until it's closed ===f
start /wait "" "%EDGE_PATH%" --new-window --app=%URL%

:: === No final message to minimize output ===
exit

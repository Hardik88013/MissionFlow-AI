$projectRoot = $PSScriptRoot

Write-Host "Starting MissionFlow AI..." -ForegroundColor Cyan

$backend = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$projectRoot'; python -m uvicorn backend.app.main:app --reload"
) -PassThru

$frontend = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$projectRoot\frontend'; npm run dev"
) -PassThru

Start-Sleep -Seconds 3

Start-Process "http://localhost:5173/dashboard"

Write-Host ""
Write-Host "MissionFlow AI started." -ForegroundColor Green
Write-Host "Dashboard: http://localhost:5173/dashboard"
Write-Host "Backend:   http://127.0.0.1:8000"
Write-Host ""
Write-Host "Close the two server windows to stop MissionFlow AI."

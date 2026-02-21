# Local dev: start Docker, then web + api (Windows PowerShell)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Starting Docker (postgres + redis)..." -ForegroundColor Cyan
Set-Location infra; docker compose up -d; Set-Location ..

Write-Host "Starting dev servers (web + api)..." -ForegroundColor Cyan
pnpm run dev

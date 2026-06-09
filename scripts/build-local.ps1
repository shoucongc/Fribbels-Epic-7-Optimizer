# Build Fribbels E7 Optimizer for local Windows use.
# Requirements: Node.js, Java 8+ (64-bit), Maven (optional if data/jar/backend.jar exists)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "==> Enabling Yarn via Corepack"
corepack enable
corepack prepare yarn@1.22.22 --activate

Write-Host "==> Installing root dependencies"
yarn install --ignore-engines

Write-Host "==> Installing app dependencies"
Push-Location app
yarn install --ignore-engines
Pop-Location

if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "==> Building Java backend"
    yarn build-backend
} else {
    Write-Host "==> Maven not found; using existing data/jar/backend.jar"
    if (-not (Test-Path "data/jar/backend.jar")) {
        Write-Error "backend.jar is missing and Maven is not installed. Install Maven or copy backend.jar to data/jar/."
    }
}

Write-Host "==> Building Electron app (webpack + installer)"
$env:NODE_OPTIONS = "--openssl-legacy-provider"
yarn build
yarn electron-builder build --win --x64 --publish never

Write-Host ""
Write-Host "Done. Output is in: $Root\release"
Get-ChildItem "$Root\release" -Filter "*.exe" | ForEach-Object { Write-Host "  Installer: $($_.FullName)" }
Get-ChildItem "$Root\release" -Filter "win-unpacked" -Directory | ForEach-Object { Write-Host "  Portable:  $($_.FullName)" }

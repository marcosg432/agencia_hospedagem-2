# Script para iniciar o sistema completo
$ErrorActionPreference = "Continue"

Write-Host "=== Iniciando Sistema de Hospedagem ===" -ForegroundColor Green

$projectPath = $PSScriptRoot
if (-not $projectPath) {
    $projectPath = Get-Location
}

# Verificar se os servidores já estão rodando
$backendRunning = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
$frontendRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# Iniciar Backend
if (-not $backendRunning) {
    Write-Host "`n[1/2] Iniciando Backend na porta 4000..." -ForegroundColor Cyan
    Set-Location "$projectPath\backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 5
} else {
    Write-Host "Backend já está rodando na porta 4000" -ForegroundColor Green
}

# Iniciar Frontend
if (-not $frontendRunning) {
    Write-Host "`n[2/2] Iniciando Frontend na porta 3000..." -ForegroundColor Cyan
    Set-Location "$projectPath\frontend"
    
    # Criar .env.local se não existir
    if (-not (Test-Path ".env.local")) {
        @"
NEXT_PUBLIC_API_URL=http://localhost:4000/api
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Host "Arquivo .env.local criado" -ForegroundColor Yellow
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 8
} else {
    Write-Host "Frontend já está rodando na porta 3000" -ForegroundColor Green
}

# Aguardar um pouco mais e abrir navegador
Start-Sleep -Seconds 3
Write-Host "`nAbrindo navegador..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`n=== Sistema iniciado! ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:4000" -ForegroundColor Yellow
Write-Host "`nNOTA: Certifique-se de que o PostgreSQL está rodando!" -ForegroundColor Red
Write-Host "Se o banco não estiver configurado, execute:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run prisma:migrate" -ForegroundColor White
Write-Host "  npm run prisma:seed" -ForegroundColor White





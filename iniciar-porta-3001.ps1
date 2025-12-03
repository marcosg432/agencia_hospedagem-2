# Script para iniciar o sistema na porta 3001
$ErrorActionPreference = "Continue"

Write-Host "=== Iniciando Sistema de Hospedagem na Porta 3001 ===" -ForegroundColor Green

$projectPath = $PSScriptRoot
if (-not $projectPath) {
    $projectPath = Get-Location
}

# Parar processos Node existentes
Write-Host "`nParando processos Node existentes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Verificar se os servidores já estão rodando
$backendRunning = Get-NetTCPConnection -LocalPort 4001 -ErrorAction SilentlyContinue
$frontendRunning = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

# Iniciar Backend
if (-not $backendRunning) {
    Write-Host "`n[1/2] Iniciando Backend na porta 4001..." -ForegroundColor Cyan
    Set-Location "$projectPath\backend"
    
    # Verificar dependências
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependências do backend..." -ForegroundColor Yellow
        npm install
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '=== BACKEND - Porta 4001 (Modo Sem Banco) ===' -ForegroundColor Green; npm run dev:no-db" -WindowStyle Normal
    Start-Sleep -Seconds 5
} else {
    Write-Host "Backend já está rodando na porta 4001" -ForegroundColor Green
}

# Iniciar Frontend
if (-not $frontendRunning) {
    Write-Host "`n[2/2] Iniciando Frontend na porta 3001..." -ForegroundColor Cyan
    Set-Location "$projectPath\frontend"
    
    # Verificar dependências
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependências do frontend..." -ForegroundColor Yellow
        npm install
    }
    
    # Criar .env.local se não existir
    if (-not (Test-Path ".env.local")) {
        @"
NEXT_PUBLIC_API_URL=http://localhost:4001/api
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Host "Arquivo .env.local criado" -ForegroundColor Yellow
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '=== FRONTEND - Porta 3001 ===' -ForegroundColor Green; npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 8
} else {
    Write-Host "Frontend já está rodando na porta 3001" -ForegroundColor Green
}

# Aguardar um pouco mais e verificar
Start-Sleep -Seconds 5
Write-Host "`nVerificando servidores..." -ForegroundColor Cyan

$frontendCheck = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
$backendCheck = Get-NetTCPConnection -LocalPort 4001 -State Listen -ErrorAction SilentlyContinue

if ($frontendCheck) {
    Write-Host "✓ Frontend rodando na porta 3001" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend NÃO está rodando" -ForegroundColor Red
}

if ($backendCheck) {
    Write-Host "✓ Backend rodando na porta 4001" -ForegroundColor Green
} else {
    Write-Host "✗ Backend NÃO está rodando" -ForegroundColor Red
}

# Abrir navegador
if ($frontendCheck) {
    Write-Host "`nAbrindo navegador em http://localhost:3001..." -ForegroundColor Green
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3001"
} else {
    Write-Host "`n⚠ Frontend não está rodando. Verifique as janelas do PowerShell para erros." -ForegroundColor Yellow
}

Write-Host "`n=== Sistema iniciado! ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:4001" -ForegroundColor Yellow
Write-Host "`nNOTA: Verifique as janelas do PowerShell para ver os logs dos servidores." -ForegroundColor Cyan




# Script para iniciar backend com verificações
Write-Host "=== Iniciando Backend ===" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"

# Verificar se está na pasta correta
if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: Execute este script na pasta backend!" -ForegroundColor Red
    exit 1
}

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠ Arquivo .env não encontrado. Criando..." -ForegroundColor Yellow
    @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hospedagem?schema=public"
JWT_SECRET="jwt-secret-super-seguro-12345"
PORT=4000
FRONTEND_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✓ Arquivo .env criado" -ForegroundColor Green
}

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Gerar Prisma Client
Write-Host "Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# Verificar PostgreSQL
Write-Host "`nVerificando PostgreSQL..." -ForegroundColor Cyan
$pgService = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq 'Running' }
if ($pgService) {
    Write-Host "✓ PostgreSQL está rodando" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL não está rodando!" -ForegroundColor Yellow
    Write-Host "  Tente iniciar o PostgreSQL manualmente" -ForegroundColor Yellow
}

# Verificar porta 4000
Write-Host "`nVerificando porta 4000..." -ForegroundColor Cyan
$portaEmUso = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue
if ($portaEmUso) {
    Write-Host "⚠ Porta 4000 já está em uso!" -ForegroundColor Yellow
    Write-Host "  PID: $($portaEmUso.OwningProcess)" -ForegroundColor Yellow
    $resposta = Read-Host "Deseja matar o processo? (s/n)"
    if ($resposta -eq 's') {
        Stop-Process -Id $portaEmUso.OwningProcess -Force
        Write-Host "✓ Processo finalizado" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

# Iniciar servidor
Write-Host "`n=== Iniciando Servidor ===" -ForegroundColor Green
Write-Host "Aguarde alguns segundos..." -ForegroundColor Yellow
Write-Host ""

npm run dev


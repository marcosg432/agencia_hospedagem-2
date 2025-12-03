# Script para executar comandos Prisma
$ErrorActionPreference = "Continue"

# Definir variável de ambiente
$env:DATABASE_URL = "postgresql://postgres:akyra123@localhost:5432/hospedagem?schema=public"

# Encontrar o diretório backend
$currentDir = $PSScriptRoot
$backendDir = Join-Path $currentDir "backend"

if (-not (Test-Path $backendDir)) {
    # Tentar caminho alternativo
    $backendDir = Get-ChildItem -Path $currentDir -Directory -Filter "backend" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
}

if (-not $backendDir -or -not (Test-Path $backendDir)) {
    Write-Host "✗ Diretório backend não encontrado!" -ForegroundColor Red
    Write-Host "  Diretório atual: $currentDir" -ForegroundColor Yellow
    exit 1
}

Set-Location $backendDir
Write-Host "✓ Diretório: $backendDir" -ForegroundColor Green
Write-Host ""

# Verificar arquivo .env
if (-not (Test-Path ".env")) {
    Write-Host "Criando arquivo .env..." -ForegroundColor Cyan
    $envContent = @"
DATABASE_URL="postgresql://postgres:akyra123@localhost:5432/hospedagem?schema=public"
JWT_SECRET="jwt-secret-super-seguro-12345"
PORT=4000
FRONTEND_URL="http://localhost:3000"
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8 -Force
    Write-Host "✓ Arquivo .env criado" -ForegroundColor Green
}

# 1. Gerar Prisma Client
Write-Host ""
Write-Host "=== 1/3 Gerando Prisma Client ===" -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao gerar Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma Client gerado com sucesso!" -ForegroundColor Green

# 2. Executar migrações
Write-Host ""
Write-Host "=== 2/3 Executando migrações (criando tabelas) ===" -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro nas migrações" -ForegroundColor Yellow
} else {
    Write-Host "✓ Migrações executadas com sucesso!" -ForegroundColor Green
}

# 3. Executar seed
Write-Host ""
Write-Host "=== 3/3 Populando banco com dados iniciais ===" -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro ao executar seed" -ForegroundColor Yellow
} else {
    Write-Host "✓ Banco populado com dados iniciais!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== CONFIGURAÇÃO CONCLUÍDA! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciais de login:" -ForegroundColor Yellow
Write-Host "  Email: admin@admin.com" -ForegroundColor White
Write-Host "  Senha: admin123" -ForegroundColor White
Write-Host ""


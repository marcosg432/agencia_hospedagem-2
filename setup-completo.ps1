# Script completo para configurar tudo
$ErrorActionPreference = "Continue"

Write-Host "=== Configuração Completa do Banco de Dados ===" -ForegroundColor Green
Write-Host ""

# Definir variável de ambiente
$env:DATABASE_URL = "postgresql://postgres:akyra123@localhost:5432/hospedagem?schema=public"

# Mudar para o diretório backend
$backendPath = Join-Path $PSScriptRoot "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "✓ Diretório backend encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ Diretório backend não encontrado!" -ForegroundColor Red
    exit 1
}

# Criar arquivo .env
Write-Host ""
Write-Host "Criando arquivo .env..." -ForegroundColor Cyan
$envContent = @"
DATABASE_URL="postgresql://postgres:akyra123@localhost:5432/hospedagem?schema=public"
JWT_SECRET="jwt-secret-super-seguro-12345"
PORT=4000
FRONTEND_URL="http://localhost:3000"
"@
$envContent | Out-File -FilePath ".env" -Encoding UTF8 -Force
Write-Host "✓ Arquivo .env criado" -ForegroundColor Green

# Verificar e instalar dependências
Write-Host ""
Write-Host "Verificando dependências..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Dependências já instaladas" -ForegroundColor Green
}

# Gerar Prisma Client
Write-Host ""
Write-Host "Gerando Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client gerado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao gerar Prisma Client" -ForegroundColor Red
    exit 1
}

# Executar migrações
Write-Host ""
Write-Host "Executando migrações (criando tabelas)..." -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Migrações executadas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "⚠ Erro nas migrações. Continuando..." -ForegroundColor Yellow
}

# Executar seed
Write-Host ""
Write-Host "Populando banco com dados iniciais..." -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Banco populado com dados iniciais!" -ForegroundColor Green
} else {
    Write-Host "⚠ Erro ao executar seed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== CONFIGURAÇÃO CONCLUÍDA! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciais de login:" -ForegroundColor Yellow
Write-Host "  Email: admin@admin.com" -ForegroundColor White
Write-Host "  Senha: admin123" -ForegroundColor White
Write-Host ""


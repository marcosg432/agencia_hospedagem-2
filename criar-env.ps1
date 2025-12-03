# Script para criar arquivos .env
Write-Host "Criando arquivos de configuração..." -ForegroundColor Cyan

# Backend .env
$backendEnv = @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hospedagem?schema=public"
JWT_SECRET="jwt-secret-super-seguro-12345"
PORT=4000
FRONTEND_URL="http://localhost:3000"
"@

if (-not (Test-Path "backend\.env")) {
    $backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "✓ Arquivo backend\.env criado" -ForegroundColor Green
} else {
    Write-Host "⚠ Arquivo backend\.env já existe" -ForegroundColor Yellow
}

# Frontend .env.local
$frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:4000/api
"@

if (-not (Test-Path "frontend\.env.local")) {
    $frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "✓ Arquivo frontend\.env.local criado" -ForegroundColor Green
} else {
    Write-Host "⚠ Arquivo frontend\.env.local já existe" -ForegroundColor Yellow
}

Write-Host "`nArquivos de configuração prontos!" -ForegroundColor Green


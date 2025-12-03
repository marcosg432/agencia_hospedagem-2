# Script para corrigir e gerar Prisma Client
Write-Host "=== Corrigindo Prisma ===" -ForegroundColor Cyan

# Remover node_modules/.prisma se existir
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma"
    Write-Host "Prisma antigo removido" -ForegroundColor Yellow
}

# Definir variável de ambiente diretamente
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/hospedagem?schema=public"

Write-Host "Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Prisma Client gerado com sucesso!" -ForegroundColor Green
    Write-Host "Agora você pode executar: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Erro ao gerar Prisma Client" -ForegroundColor Red
    Write-Host 'Tente executar manualmente: npx prisma generate' -ForegroundColor Yellow
}


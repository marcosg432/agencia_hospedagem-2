# Script para reorganizar repositório Git removendo caminho OneDrive

Write-Host "=== Reorganizando Repositório ===" -ForegroundColor Cyan

# Criar diretório temporário
$tempDir = "$env:TEMP\agencia-2-clean"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "Copiando arquivos..." -ForegroundColor Yellow

# Copiar backend
if (Test-Path "backend") {
    Copy-Item -Recurse -Force "backend" "$tempDir\backend"
    Write-Host "✓ Backend copiado" -ForegroundColor Green
}

# Copiar frontend
if (Test-Path "frontend") {
    Copy-Item -Recurse -Force "frontend" "$tempDir\frontend"
    Write-Host "✓ Frontend copiado" -ForegroundColor Green
}

# Copiar arquivos raiz
$rootFiles = @(".gitignore", ".htaccess", "deploy-hostinger.sh", "setup-kw4.sh", "ecosystem.config.js")
$rootFiles += Get-ChildItem -Filter "*.ps1" -File | Select-Object -ExpandProperty Name
$rootFiles += Get-ChildItem -Filter "*.bat" -File | Select-Object -ExpandProperty Name

foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Copy-Item -Force $file "$tempDir\$file"
    }
}

Write-Host "Arquivos copiados para: $tempDir" -ForegroundColor Green
Write-Host "Agora execute os comandos Git em: $tempDir" -ForegroundColor Yellow


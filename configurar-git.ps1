# Script para configurar Git e fazer push para GitHub
# Execute: .\configurar-git.ps1

$ErrorActionPreference = "Stop"

# Navegar para o diretório do projeto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "=== CONFIGURANDO GIT ===" -ForegroundColor Cyan
Write-Host "Diretório: $projectPath" -ForegroundColor Gray

# Remover .git se existir
if (Test-Path .git) {
    Write-Host "Removendo repositório Git existente..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git
}

# Configurar Git
Write-Host "`nConfigurando Git..." -ForegroundColor Yellow
git config user.name "marcosg432"
git config user.email "mg9149303@gmail.com"

# Inicializar repositório
Write-Host "Inicializando repositório Git..." -ForegroundColor Yellow
git init

# Adicionar arquivos
Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
git add .

# Fazer commit
Write-Host "Fazendo commit inicial..." -ForegroundColor Yellow
git commit -m "Initial commit: Sistema de Gerenciamento de Hospedagem"

# Configurar remote
Write-Host "Configurando remote..." -ForegroundColor Yellow
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin https://github.com/marcosg432/agencia_hospedagem.git

# Renomear branch para main
Write-Host "Renomeando branch para main..." -ForegroundColor Yellow
git branch -M main

Write-Host "`n✅ REPOSITÓRIO CONFIGURADO!" -ForegroundColor Green
Write-Host "`n📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Crie o repositório no GitHub (se ainda não criou):" -ForegroundColor Yellow
Write-Host "   https://github.com/new" -ForegroundColor White
Write-Host "   Nome: agencia_hospedagem" -ForegroundColor White
Write-Host "   Visibilidade: Público ou Privado" -ForegroundColor White
Write-Host "   NÃO inicialize com README, .gitignore ou license" -ForegroundColor White
Write-Host "`n2. Execute o push:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host "`n⚠ IMPORTANTE: Você precisará autenticar" -ForegroundColor Yellow
Write-Host "   Username: marcosg432" -ForegroundColor Gray
Write-Host "   Senha: Use um Personal Access Token (PAT)" -ForegroundColor Gray
Write-Host "   Como criar PAT: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "   Permissões necessárias: repo (todas)" -ForegroundColor Gray


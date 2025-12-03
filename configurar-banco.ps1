# Script para configurar banco de dados após instalação do PostgreSQL
Write-Host "=== Configuração do Banco de Dados ===" -ForegroundColor Green
Write-Host ""

# Perguntar a senha do PostgreSQL
Write-Host "IMPORTANTE: Qual senha você configurou para o usuario 'postgres'?" -ForegroundColor Yellow
Write-Host "Digite a senha (ela nao sera exibida por seguranca):" -ForegroundColor Cyan
$senhaPostgres = Read-Host -AsSecureString
$senhaPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($senhaPostgres))

Write-Host ""
Write-Host "Atualizando arquivo .env..." -ForegroundColor Cyan

# Atualizar .env do backend
$envContent = @"
DATABASE_URL="postgresql://postgres:$senhaPlain@localhost:5432/hospedagem?schema=public"
JWT_SECRET="jwt-secret-super-seguro-12345"
PORT=4000
FRONTEND_URL="http://localhost:3000"
"@

$envPath = "backend\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -Force
Write-Host "✓ Arquivo .env atualizado" -ForegroundColor Green

Write-Host ""
Write-Host "Agora vamos criar o banco de dados..." -ForegroundColor Cyan
Write-Host ""
Write-Host "OPCOES:" -ForegroundColor Yellow
Write-Host "1. Criar via pgAdmin (RECOMENDADO - mais facil)" -ForegroundColor White
Write-Host "2. Tentar criar via linha de comando" -ForegroundColor White
Write-Host ""
$opcao = Read-Host "Escolha uma opcao (1 ou 2)"

if ($opcao -eq "2") {
    Write-Host ""
    Write-Host "Tentando criar banco via linha de comando..." -ForegroundColor Cyan
    
    # Tentar encontrar psql
    $psqlPaths = @(
        "C:\Program Files\PostgreSQL\18\bin\psql.exe",
        "C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe"
    )
    
    $psqlFound = $false
    foreach ($path in $psqlPaths) {
        if (Test-Path $path) {
            Write-Host "Encontrado PostgreSQL em: $path" -ForegroundColor Green
            $env:PGPASSWORD = $senhaPlain
            & $path -U postgres -c "CREATE DATABASE hospedagem;" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Banco de dados criado com sucesso!" -ForegroundColor Green
                $psqlFound = $true
                break
            } else {
                Write-Host "Banco pode ja existir ou houve erro. Continuando..." -ForegroundColor Yellow
                $psqlFound = $true
                break
            }
        }
    }
    
    if (-not $psqlFound) {
        Write-Host ""
        Write-Host "⚠ Nao foi possivel encontrar psql automaticamente." -ForegroundColor Yellow
        Write-Host "Por favor, crie o banco manualmente via pgAdmin:" -ForegroundColor Yellow
        Write-Host "  1. Abra o pgAdmin" -ForegroundColor White
        Write-Host "  2. Clique com botao direito em 'Databases'" -ForegroundColor White
        Write-Host "  3. Selecione 'Create' -> 'Database...'" -ForegroundColor White
        Write-Host "  4. Nome: hospedagem" -ForegroundColor White
        Write-Host "  5. Clique em 'Save'" -ForegroundColor White
        Write-Host ""
        Read-Host "Pressione ENTER quando o banco estiver criado"
    }
} else {
    Write-Host ""
    Write-Host "Por favor, crie o banco via pgAdmin:" -ForegroundColor Yellow
    Write-Host "  1. Abra o pgAdmin (procure no menu Iniciar)" -ForegroundColor White
    Write-Host "  2. Na primeira vez, crie uma senha master (pode ser qualquer uma)" -ForegroundColor White
    Write-Host "  3. Expanda 'Servers' -> 'PostgreSQL XX'" -ForegroundColor White
    Write-Host "  4. Clique com botao direito em 'Databases'" -ForegroundColor White
    Write-Host "  5. Selecione 'Create' -> 'Database...'" -ForegroundColor White
    Write-Host "  6. Nome: hospedagem" -ForegroundColor White
    Write-Host "  7. Clique em 'Save'" -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione ENTER quando o banco estiver criado"
}

Write-Host ""
Write-Host "=== Executando configuracoes finais ===" -ForegroundColor Green
Write-Host ""

# Gerar Prisma Client
Write-Host "Gerando Prisma Client..." -ForegroundColor Cyan
Set-Location backend
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro ao gerar Prisma Client. Tentando com npx..." -ForegroundColor Yellow
    npx prisma generate
}

# Executar migrações
Write-Host ""
Write-Host "Executando migracoes (criando tabelas)..." -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro nas migracoes. Verifique se o banco foi criado corretamente." -ForegroundColor Yellow
}

# Executar seed
Write-Host ""
Write-Host "Populando banco com dados iniciais..." -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro ao executar seed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== CONFIGURACAO CONCLUIDA! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciais de login:" -ForegroundColor Yellow
Write-Host "  Email: admin@admin.com" -ForegroundColor White
Write-Host "  Senha: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Para iniciar o sistema:" -ForegroundColor Yellow
Write-Host "  .\iniciar-sistema.ps1" -ForegroundColor White
Write-Host ""

Set-Location ..







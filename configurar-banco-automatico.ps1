# Script automatizado para configurar banco de dados
Write-Host "=== Configuração Automática do Banco de Dados ===" -ForegroundColor Green
Write-Host ""

# Tentar criar o banco com senha padrão comum
Write-Host "Tentando criar o banco de dados 'hospedagem'..." -ForegroundColor Cyan

$senhaPostgres = "postgres"
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Tentar criar o banco
$env:PGPASSWORD = $senhaPostgres
$createDb = & $psqlPath -U postgres -c "SELECT 1 FROM pg_database WHERE datname='hospedagem';" 2>&1

# Verificar se banco já existe ou precisa ser criado
$dbExists = & $psqlPath -U postgres -lqt 2>&1 | Select-String -Pattern "hospedagem"

if (-not $dbExists) {
    Write-Host "Criando banco de dados 'hospedagem'..." -ForegroundColor Yellow
    $result = & $psqlPath -U postgres -c "CREATE DATABASE hospedagem;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Banco de dados criado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "⚠ Erro ao criar banco. Tentando continuar..." -ForegroundColor Yellow
        Write-Host "  Se o banco já existir, isso é normal." -ForegroundColor Gray
    }
} else {
    Write-Host "✓ Banco de dados 'hospedagem' já existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Configurando arquivo .env ===" -ForegroundColor Green

# Criar/atualizar .env com senha padrão (usuário pode editar depois)
$envContent = @"
DATABASE_URL="postgresql://postgres:$senhaPostgres@localhost:5432/hospedagem?schema=public"
JWT_SECRET="jwt-secret-super-seguro-12345"
PORT=4000
FRONTEND_URL="http://localhost:3000"
"@

$envPath = "backend\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -Force
Write-Host "✓ Arquivo .env criado/atualizado" -ForegroundColor Green
Write-Host "  ⚠ Se sua senha do PostgreSQL for diferente de 'postgres', edite o arquivo backend\.env" -ForegroundColor Yellow

Write-Host ""
Write-Host "=== Instalando dependências (se necessário) ===" -ForegroundColor Green
Set-Location backend

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências do npm..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✓ Dependências já instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Gerando Prisma Client ===" -ForegroundColor Green
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro ao gerar Prisma Client" -ForegroundColor Yellow
    Write-Host "  Verifique se a senha do PostgreSQL está correta no arquivo .env" -ForegroundColor Yellow
} else {
    Write-Host "✓ Prisma Client gerado com sucesso!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Executando migrações (criando tabelas) ===" -ForegroundColor Green
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro nas migrações" -ForegroundColor Yellow
    Write-Host "  Possíveis causas:" -ForegroundColor Yellow
    Write-Host "    - Senha do PostgreSQL incorreta no .env" -ForegroundColor White
    Write-Host "    - Banco de dados não foi criado" -ForegroundColor White
    Write-Host "    - PostgreSQL não está rodando" -ForegroundColor White
} else {
    Write-Host "✓ Migrações executadas com sucesso!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Populando banco com dados iniciais ===" -ForegroundColor Green
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro ao executar seed" -ForegroundColor Yellow
} else {
    Write-Host "✓ Banco populado com dados iniciais!" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "=== CONFIGURAÇÃO CONCLUÍDA! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciais de login (se o seed foi executado):" -ForegroundColor Yellow
Write-Host "  Email: admin@admin.com" -ForegroundColor White
Write-Host "  Senha: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Para iniciar o sistema:" -ForegroundColor Yellow
Write-Host "  .\iniciar-sistema.ps1" -ForegroundColor White
Write-Host ""


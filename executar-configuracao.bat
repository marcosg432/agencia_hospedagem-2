@echo off
chcp 65001 >nul
echo === Configurando Banco de Dados ===
echo.

cd /d "%~dp0backend"

set DATABASE_URL=postgresql://postgres:akyra123@localhost:5432/hospedagem?schema=public

echo === 1/3 Gerando Prisma Client ===
call npx prisma generate
if errorlevel 1 (
    echo Erro ao gerar Prisma Client
    pause
    exit /b 1
)

echo.
echo === 2/3 Executando migrações ===
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo Aviso: Erro nas migrações
)

echo.
echo === 3/3 Populando banco com dados iniciais ===
call npm run prisma:seed
if errorlevel 1 (
    echo Aviso: Erro ao executar seed
)

echo.
echo === CONFIGURAÇÃO CONCLUÍDA! ===
echo.
echo Credenciais de login:
echo   Email: admin@admin.com
echo   Senha: admin123
echo.
pause


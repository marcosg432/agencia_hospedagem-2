@echo off
echo ========================================
echo Iniciando Sistema de Hospedagem
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Iniciando Backend na porta 4001 (Modo Sem Banco)...
start "Backend - Porta 4001" cmd /k "cd backend && npm run dev:no-db"

timeout /t 5 /nobreak >nul

echo [2/2] Iniciando Frontend na porta 3001...
start "Frontend - Porta 3001" cmd /k "cd frontend && npm run dev"

timeout /t 15 /nobreak >nul

echo.
echo Abrindo navegador em http://localhost:3001...
start http://localhost:3001

echo.
echo ========================================
echo Servidores iniciados!
echo Frontend: http://localhost:3001
echo Backend: http://localhost:4001
echo ========================================
echo.
echo Verifique as janelas do CMD que foram abertas.
echo Pressione qualquer tecla para sair...
pause >nul




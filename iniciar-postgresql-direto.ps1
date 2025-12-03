# Script para iniciar PostgreSQL diretamente quando o servico nao existe
Write-Host "=== Iniciando PostgreSQL Diretamente ===" -ForegroundColor Green
Write-Host ""

# Verificar versoes possiveis do PostgreSQL
$versoes = @("17", "16", "15", "18")
$postgresPath = $null
$dataPath = $null

foreach ($versao in $versoes) {
    $binPath = "C:\Program Files\PostgreSQL\$versao\bin"
    $dataPathTest = "C:\Program Files\PostgreSQL\$versao\data"
    
    if (Test-Path $binPath) {
        if (Test-Path "$binPath\postgres.exe") {
            $postgresPath = $binPath
            if (Test-Path $dataPathTest) {
                $dataPath = $dataPathTest
                Write-Host "✓ PostgreSQL $versao encontrado!" -ForegroundColor Green
                Write-Host "  Binarios: $postgresPath" -ForegroundColor Cyan
                Write-Host "  Dados: $dataPath" -ForegroundColor Cyan
                break
            }
        }
    }
}

if (-not $postgresPath) {
    Write-Host "✗ PostgreSQL nao encontrado nas localizacoes padrao!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solucoes:" -ForegroundColor Yellow
    Write-Host "1. Reinstale o PostgreSQL e certifique-se de marcar 'Install as a service'" -ForegroundColor White
    Write-Host "2. Ou reinicie o computador apos a instalacao" -ForegroundColor White
    exit 1
}

# Verificar se ja esta rodando
$processos = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
if ($processos) {
    Write-Host ""
    Write-Host "✓ PostgreSQL ja esta rodando!" -ForegroundColor Green
    Write-Host "  Processos encontrados: $($processos.Count)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Tente abrir o pgAdmin novamente agora." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "=== SOLUCAO MANUAL ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para resolver o problema do pgAdmin travado:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Feche o pgAdmin (se estiver aberto)" -ForegroundColor White
Write-Host "2. Abra o PowerShell como ADMINISTRADOR:" -ForegroundColor White
Write-Host "   - Clique com botao direito no PowerShell" -ForegroundColor Gray
Write-Host "   - Selecione 'Executar como administrador'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Execute estes comandos:" -ForegroundColor White
Write-Host "   cd `"$postgresPath`"" -ForegroundColor Cyan
Write-Host "   .\pg_ctl.exe register -N `"postgresql-x64-17`" -D `"$dataPath`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Depois, inicie o servico:" -ForegroundColor White
Write-Host "   Start-Service postgresql-x64-17" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Abra o pgAdmin novamente" -ForegroundColor White
Write-Host ""

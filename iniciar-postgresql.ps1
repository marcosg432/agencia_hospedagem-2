# Script para iniciar o PostgreSQL automaticamente
Write-Host "=== Iniciando PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se já está rodando
Write-Host "Verificando se o PostgreSQL já está rodando..." -ForegroundColor Yellow
$processos = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
if ($processos) {
    Write-Host "✓ PostgreSQL já está rodando!" -ForegroundColor Green
    Write-Host "  Processos encontrados: $($processos.Count)" -ForegroundColor Cyan
    Write-Host ""
    exit 0
}

# Tentar encontrar e iniciar o serviço do Windows
Write-Host "Procurando serviço do PostgreSQL..." -ForegroundColor Yellow
$servicos = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue

if ($servicos) {
    # Encontrar o serviço principal (não o Scheduling Agent)
    $servicoPrincipal = $servicos | Where-Object { 
        $_.Name -notlike "*Scheduling*" -and 
        $_.Name -notlike "*Agent*" 
    } | Select-Object -First 1
    
    if ($servicoPrincipal) {
        Write-Host "✓ Serviço encontrado: $($servicoPrincipal.Name)" -ForegroundColor Green
        
        if ($servicoPrincipal.Status -eq 'Running') {
            Write-Host "✓ O serviço já está rodando!" -ForegroundColor Green
        } else {
            Write-Host "Iniciando serviço..." -ForegroundColor Yellow
            try {
                Start-Service -Name $servicoPrincipal.Name -ErrorAction Stop
                Write-Host "✓ Serviço iniciado com sucesso!" -ForegroundColor Green
                
                # Aguardar alguns segundos para garantir que iniciou
                Start-Sleep -Seconds 3
                
                # Verificar se está rodando
                $servicoAtualizado = Get-Service -Name $servicoPrincipal.Name
                if ($servicoAtualizado.Status -eq 'Running') {
                    Write-Host "✓ PostgreSQL está rodando e pronto para uso!" -ForegroundColor Green
                } else {
                    Write-Host "⚠ O serviço foi iniciado, mas o status ainda não é 'Running'" -ForegroundColor Yellow
                    Write-Host "  Aguarde alguns segundos e verifique novamente." -ForegroundColor Yellow
                }
            } catch {
                Write-Host "✗ Erro ao iniciar serviço: $_" -ForegroundColor Red
                Write-Host ""
                Write-Host "Tente iniciar manualmente:" -ForegroundColor Yellow
                Write-Host "  1. Abra 'services.msc' (Win+R, digite services.msc)" -ForegroundColor White
                Write-Host "  2. Procure por '$($servicoPrincipal.Name)'" -ForegroundColor White
                Write-Host "  3. Clique com botão direito e selecione 'Iniciar'" -ForegroundColor White
                exit 1
            }
        }
    } else {
        Write-Host "⚠ Serviço do PostgreSQL não encontrado (apenas serviços auxiliares)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Soluções:" -ForegroundColor Cyan
        Write-Host "  1. Abra o pgAdmin - ele pode iniciar o PostgreSQL automaticamente" -ForegroundColor White
        Write-Host "  2. Ou execute como administrador: .\iniciar-postgresql-direto.ps1" -ForegroundColor White
    }
} else {
    Write-Host "⚠ Nenhum serviço do PostgreSQL encontrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "O PostgreSQL pode não estar instalado ou o serviço não foi criado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Cyan
    Write-Host "  1. Abra o pgAdmin (Menu Iniciar) - ele pode iniciar automaticamente" -ForegroundColor White
    Write-Host "  2. Verifique se o PostgreSQL está instalado procurando 'pgAdmin' no Menu Iniciar" -ForegroundColor White
    Write-Host "  3. Se não encontrar, instale o PostgreSQL primeiro" -ForegroundColor White
    Write-Host ""
    Write-Host "Para mais informações, consulte: COMO-ABRIR-POSTGRESQL.md" -ForegroundColor Gray
}

Write-Host ""


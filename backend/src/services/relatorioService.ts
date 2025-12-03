import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RelatorioMes {
  mes: number;
  ano: number;
  totalReservas: number;
  reservasConfirmadas: number;
  totalFaturado: number;
  taxaOcupacao: number;
  diasLivres: number;
  diasOcupados: number;
  diasBloqueados: number;
}

export async function gerarRelatorioMes(ano: number, mes: number): Promise<RelatorioMes> {
  console.log('=== GERANDO RELATÓRIO DO MÊS ===');
  console.log('Ano:', ano, 'Mês:', mes);

  const primeiroDia = new Date(ano, mes - 1, 1);
  const ultimoDia = new Date(ano, mes, 0);
  const diasNoMes = ultimoDia.getDate();

  console.log('Primeiro dia:', primeiroDia.toISOString());
  console.log('Último dia:', ultimoDia.toISOString());
  console.log('Dias no mês:', diasNoMes);

  // Buscar reservas do mês
  console.log('Buscando reservas no banco...');
  const reservas = await prisma.reserva.findMany({
    where: {
      OR: [
        {
          checkIn: {
            gte: primeiroDia,
            lte: ultimoDia,
          },
        },
        {
          checkOut: {
            gte: primeiroDia,
            lte: ultimoDia,
          },
        },
        {
          AND: [
            { checkIn: { lte: primeiroDia } },
            { checkOut: { gte: ultimoDia } },
          ],
        },
      ],
    },
  });
  console.log(`✓ ${reservas.length} reserva(s) encontrada(s) no banco`);

  // Filtrar apenas reservas CONFIRMADAS
  const reservasConfirmadas = reservas.filter(r => {
    const status = (r.status || '').toLowerCase().trim();
    return status === 'confirmada';
  });

  console.log(`✓ ${reservasConfirmadas.length} reserva(s) confirmada(s) de ${reservas.length} total`);

  // Calcular total faturado (apenas reservas confirmadas)
  const totalFaturado = reservasConfirmadas.reduce((sum, r) => {
    const valor = parseFloat(r.valorTotal?.toString() || '0');
    console.log(`  Reserva ${r.id}: R$ ${valor.toFixed(2)}`);
    return sum + valor;
  }, 0);

  console.log(`✓ Total faturado: R$ ${totalFaturado.toFixed(2)}`);

  // Buscar bloqueios
  console.log('Buscando bloqueios no banco...');
  const bloqueios = await prisma.bloqueio.findMany({
    where: {
      data: {
        gte: primeiroDia,
        lte: ultimoDia,
      },
    },
  });
  console.log(`✓ ${bloqueios.length} bloqueio(s) encontrado(s) no banco`);

  // Calcular dias ocupados por reservas confirmadas
  const diasOcupadosSet = new Set<string>();
  reservasConfirmadas.forEach(r => {
    const checkIn = new Date(r.checkIn);
    const checkOut = new Date(r.checkOut);
    
    // Iterar por cada dia da reserva
    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      // Normalizar data para comparar apenas dia/mês/ano
      const dataNormalizada = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (dataNormalizada >= primeiroDia && dataNormalizada <= ultimoDia) {
        const dataStr = dataNormalizada.toISOString().split('T')[0];
        diasOcupadosSet.add(dataStr);
      }
    }
  });

  const diasOcupados = diasOcupadosSet.size;
  console.log(`✓ Dias ocupados por reservas: ${diasOcupados}`);

  // Calcular dias bloqueados
  const diasBloqueadosSet = new Set<string>();
  bloqueios.forEach(b => {
    const dataBloqueio = b.data instanceof Date ? b.data : new Date(b.data);
    const dataNormalizada = new Date(dataBloqueio.getFullYear(), dataBloqueio.getMonth(), dataBloqueio.getDate());
    if (dataNormalizada >= primeiroDia && dataNormalizada <= ultimoDia) {
      const dataStr = dataNormalizada.toISOString().split('T')[0];
      diasBloqueadosSet.add(dataStr);
    }
  });

  const diasBloqueados = diasBloqueadosSet.size;
  console.log(`✓ Dias bloqueados: ${diasBloqueados}`);

  // Calcular dias livres
  const diasLivres = Math.max(0, diasNoMes - diasOcupados - diasBloqueados);
  console.log(`✓ Dias livres: ${diasLivres}`);

  // Calcular taxa de ocupação (dias ocupados + bloqueados / total de dias)
  const diasIndisponiveis = diasOcupados + diasBloqueados;
  const taxaOcupacao = diasNoMes > 0 ? (diasIndisponiveis / diasNoMes) * 100 : 0;
  console.log(`✓ Taxa de ocupação: ${taxaOcupacao.toFixed(2)}%`);

  const relatorio = {
    mes,
    ano,
    totalReservas: reservas.length,
    reservasConfirmadas: reservasConfirmadas.length,
    totalFaturado: Math.round(totalFaturado * 100) / 100, // Arredondar para 2 casas decimais
    taxaOcupacao: Math.round(taxaOcupacao * 100) / 100, // Arredondar para 2 casas decimais
    diasLivres,
    diasOcupados,
    diasBloqueados,
  };

  console.log('=== RELATÓRIO GERADO ===');
  console.log(JSON.stringify(relatorio, null, 2));

  return relatorio;
}



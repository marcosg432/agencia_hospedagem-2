import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DiaCalendario {
  data: Date;
  status: 'livre' | 'ocupado' | 'bloqueado';
  reservas?: any[];
}

export async function obterCalendarioMes(ano: number, mes: number): Promise<DiaCalendario[]> {
  const dias: DiaCalendario[] = [];
  const primeiroDia = new Date(ano, mes - 1, 1);
  const ultimoDia = new Date(ano, mes, 0);
  
  // Buscar TODAS as reservas do mês (não apenas confirmadas)
  console.log('Buscando reservas para calendário...');
  const reservas = await prisma.reserva.findMany({
    where: {
      // Removido filtro de status - buscar TODAS as reservas
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
    orderBy: { checkIn: 'asc' },
  });
  console.log(`✓ ${reservas.length} reserva(s) encontrada(s) para o calendário`);

  // Buscar bloqueios do mês
  console.log('Buscando bloqueios para o calendário...');
  const bloqueios = await prisma.bloqueio.findMany({
    where: {
      data: {
        gte: primeiroDia,
        lte: ultimoDia,
      },
    },
  });
  console.log(`✓ ${bloqueios.length} bloqueio(s) encontrado(s) no banco`);

  const bloqueiosSet = new Set(
    bloqueios.map((b: any) => {
      const dataBloqueio = b.data instanceof Date ? b.data : new Date(b.data);
      return dataBloqueio.toISOString().split('T')[0];
    })
  );

  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const data = new Date(ano, mes - 1, dia);
    const dataStr = data.toISOString().split('T')[0];
    
    // Verificar se está bloqueado
    if (bloqueiosSet.has(dataStr)) {
      dias.push({
        data,
        status: 'bloqueado',
      });
      continue;
    }

    // Verificar se está ocupado (considerar apenas reservas confirmadas ou pendentes)
    const reservasValidas = reservas.filter((r: any) => {
      const status = r.status || 'pendente';
      return status === 'confirmada' || status === 'pendente';
    });

    const ocupado = reservasValidas.some((r: any) => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return data >= checkIn && data < checkOut;
    });

    if (ocupado) {
      const reservasDoDia = reservasValidas.filter((r: any) => {
        const checkIn = new Date(r.checkIn);
        const checkOut = new Date(r.checkOut);
        return data >= checkIn && data < checkOut;
      });

      dias.push({
        data,
        status: 'ocupado',
        reservas: reservasDoDia,
      });
    } else {
      dias.push({
        data,
        status: 'livre',
      });
    }
  }

  return dias;
}



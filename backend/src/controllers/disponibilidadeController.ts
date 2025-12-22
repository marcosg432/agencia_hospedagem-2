import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Endpoint público para verificar disponibilidade de quartos
export const verificarDisponibilidade = async (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut, quarto } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ 
        error: 'Datas de check-in e check-out são obrigatórias' 
      });
    }

    const dataCheckIn = new Date(checkIn as string);
    const dataCheckOut = new Date(checkOut as string);

    if (isNaN(dataCheckIn.getTime()) || isNaN(dataCheckOut.getTime())) {
      return res.status(400).json({ 
        error: 'Datas inválidas' 
      });
    }

    if (dataCheckOut <= dataCheckIn) {
      return res.status(400).json({ 
        error: 'Data de check-out deve ser após check-in' 
      });
    }

    // Buscar reservas que conflitam com o período
    const reservasConflitantes = await prisma.reserva.findMany({
      where: {
        quarto: quarto ? (quarto as string) : undefined,
        status: {
          in: ['pendente', 'confirmada'], // Apenas reservas ativas
        },
        OR: [
          {
            // Check-in dentro do período
            checkIn: {
              gte: dataCheckIn,
              lt: dataCheckOut,
            },
          },
          {
            // Check-out dentro do período
            checkOut: {
              gt: dataCheckIn,
              lte: dataCheckOut,
            },
          },
          {
            // Período engloba completamente
            AND: [
              { checkIn: { lte: dataCheckIn } },
              { checkOut: { gte: dataCheckOut } },
            ],
          },
        ],
      },
    });

    // Buscar bloqueios no período
    const bloqueios = await prisma.bloqueio.findMany({
      where: {
        data: {
          gte: dataCheckIn,
          lte: dataCheckOut,
        },
      },
    });

    const disponivel = reservasConflitantes.length === 0 && bloqueios.length === 0;

    // Buscar todas as reservas e bloqueios para mostrar períodos ocupados
    const todasReservas = await prisma.reserva.findMany({
      where: {
        status: {
          in: ['pendente', 'confirmada'],
        },
      },
      select: {
        checkIn: true,
        checkOut: true,
        quarto: true,
        nome: true,
      },
      orderBy: {
        checkIn: 'asc',
      },
    });

    const todosBloqueios = await prisma.bloqueio.findMany({
      select: {
        data: true,
        motivo: true,
      },
      orderBy: {
        data: 'asc',
      },
    });

    return res.json({
      disponivel,
      reservasConflitantes: reservasConflitantes.map((r: any) => ({
        id: r.id,
        quarto: r.quarto,
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        nome: r.nome,
      })),
      bloqueios: bloqueios.map((b: any) => ({
        data: b.data,
        motivo: b.motivo,
      })),
      todasReservas,
      todosBloqueios,
    });
  } catch (error: any) {
    console.error('Erro ao verificar disponibilidade:', error);
    return res.status(500).json({ 
      error: 'Erro ao verificar disponibilidade',
      details: error.message 
    });
  }
};


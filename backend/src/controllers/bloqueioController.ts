import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BloqueioRequest } from '../types';

const prisma = new PrismaClient();

export const criarBloqueio = async (
  req: Request<{}, {}, BloqueioRequest>,
  res: Response
) => {
  try {
    console.log('=== POST /bloqueios CHAMADO ===');
    const { data, motivo } = req.body;
    console.log('Data recebida:', data);
    console.log('Motivo recebido:', motivo);

    if (!data) {
      console.error('ERRO: Data não fornecida');
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    try {
      const bloqueio = await prisma.bloqueio.create({
        data: {
          data: new Date(data),
          motivo: motivo || 'limpeza',
        },
      });

      console.log('✓ Bloqueio criado com sucesso no banco:', bloqueio.id);
      return res.status(201).json(bloqueio);
    } catch (dbError: any) {
      console.error('ERRO ao criar bloqueio no banco:', dbError);
      if (dbError.code === 'P2002') {
        return res.status(400).json({ error: 'Data já está bloqueada' });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('ERRO GERAL ao criar bloqueio:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

export const listarBloqueios = async (req: Request, res: Response) => {
  try {
    console.log('=== GET /bloqueios CHAMADO ===');
    const { ano, mes } = req.query;
    console.log('Ano:', ano, 'Mês:', mes);

    let where: any = {};

    if (ano && mes) {
      const primeiroDia = new Date(parseInt(ano as string), parseInt(mes as string) - 1, 1);
      const ultimoDia = new Date(parseInt(ano as string), parseInt(mes as string), 0);

      where.data = {
        gte: primeiroDia,
        lte: ultimoDia,
      };
    }

    console.log('Buscando bloqueios no banco...');
    const bloqueios = await prisma.bloqueio.findMany({
      where,
      orderBy: { data: 'asc' },
    });
    console.log(`✓ ${bloqueios.length} bloqueio(s) encontrado(s) no banco`);

    res.json(bloqueios);
  } catch (error: any) {
    console.error('ERRO ao listar bloqueios:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

export const deletarBloqueio = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    console.log('=== DELETE /bloqueios/:id CHAMADO ===');
    const { id } = req.params;
    console.log('ID do bloqueio:', id);

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      await prisma.bloqueio.delete({
        where: { id: parseInt(id) },
      });

      console.log(`✓ Bloqueio ${id} deletado do banco com sucesso`);
      return res.status(204).send();
    } catch (dbError: any) {
      console.error('ERRO ao deletar bloqueio no banco:', dbError);
      if (dbError.code === 'P2025') {
        return res.status(404).json({ error: 'Bloqueio não encontrado' });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('ERRO GERAL ao deletar bloqueio:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};



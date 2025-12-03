import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrecoRequest } from '../types';

const prisma = new PrismaClient();

export const listarPrecos = async (req: Request, res: Response) => {
  try {
    const precos = await prisma.preco.findMany({
      orderBy: { tipo: 'asc' },
    });

    res.json(precos);
  } catch (error) {
    console.error('Erro ao listar preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const atualizarPreco = async (
  req: Request<{ id: string }, {}, PrecoRequest>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { tipo, valor, descricao, dataEspecial } = req.body;

    if (!valor) {
      return res.status(400).json({ error: 'Valor é obrigatório' });
    }

    const preco = await prisma.preco.update({
      where: { id: parseInt(id) },
      data: {
        tipo,
        valor,
        descricao,
        dataEspecial: dataEspecial ? new Date(dataEspecial) : null,
      },
    });

    res.json(preco);
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const criarPreco = async (
  req: Request<{}, {}, PrecoRequest>,
  res: Response
) => {
  try {
    const { tipo, valor, descricao, dataEspecial } = req.body;

    if (!tipo || !valor) {
      return res.status(400).json({ error: 'Tipo e valor são obrigatórios' });
    }

    const preco = await prisma.preco.create({
      data: {
        tipo,
        valor,
        descricao,
        dataEspecial: dataEspecial ? new Date(dataEspecial) : null,
      },
    });

    res.status(201).json(preco);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Tipo de preço já existe' });
    }
    console.error('Erro ao criar preço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};





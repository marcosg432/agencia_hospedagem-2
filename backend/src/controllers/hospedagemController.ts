import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { HospedagemRequest } from '../types';

const prisma = new PrismaClient();

export const obterHospedagem = async (req: Request, res: Response) => {
  try {
    const hospedagem = await prisma.hospedagem.findFirst();

    if (!hospedagem) {
      return res.status(404).json({ error: 'Hospedagem não encontrada' });
    }

    res.json(hospedagem);
  } catch (error) {
    console.error('Erro ao obter hospedagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const atualizarHospedagem = async (
  req: Request<{}, {}, HospedagemRequest>,
  res: Response
) => {
  try {
    const { nome, endereco, telefone, whatsapp, capacidadeMax, fotos, descricao } = req.body;

    // Buscar hospedagem existente ou criar
    let hospedagem = await prisma.hospedagem.findFirst();

    if (hospedagem) {
      hospedagem = await prisma.hospedagem.update({
        where: { id: hospedagem.id },
        data: {
          nome,
          endereco,
          telefone,
          whatsapp,
          capacidadeMax,
          fotos,
          descricao,
        },
      });
    } else {
      hospedagem = await prisma.hospedagem.create({
        data: {
          nome,
          endereco,
          telefone,
          whatsapp,
          capacidadeMax,
          fotos,
          descricao,
        },
      });
    }

    res.json(hospedagem);
  } catch (error) {
    console.error('Erro ao atualizar hospedagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};





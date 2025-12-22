import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ReservaRequest, UpdateStatusRequest } from '../types';
import { gerarMensagemConfirmacao, gerarMensagemLembrete } from '../services/whatsappService';

const prisma = new PrismaClient();

export const criarReserva = async (
  req: Request<{}, {}, ReservaRequest>,
  res: Response
) => {
  try {
    console.log('=== TENTATIVA DE CRIAR RESERVA ===');
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));

    const { nome, telefone, qtdPessoas, checkIn, checkOut, valorTotal, observacoes } = req.body;

    // Validação detalhada
    if (!nome || nome.trim() === '') {
      console.error('ERRO: Nome não fornecido');
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    if (!telefone || telefone.trim() === '') {
      console.error('ERRO: Telefone não fornecido');
      return res.status(400).json({ error: 'Telefone é obrigatório' });
    }
    if (!checkIn) {
      console.error('ERRO: Check-in não fornecido');
      return res.status(400).json({ error: 'Data de check-in é obrigatória' });
    }
    if (!checkOut) {
      console.error('ERRO: Check-out não fornecido');
      return res.status(400).json({ error: 'Data de check-out é obrigatória' });
    }
    if (!valorTotal || valorTotal <= 0) {
      console.error('ERRO: Valor total inválido:', valorTotal);
      return res.status(400).json({ error: 'Valor total deve ser maior que zero' });
    }

    // Validar datas
    const dataCheckIn = new Date(checkIn);
    const dataCheckOut = new Date(checkOut);
    
    if (isNaN(dataCheckIn.getTime())) {
      console.error('ERRO: Data de check-in inválida:', checkIn);
      return res.status(400).json({ error: 'Data de check-in inválida' });
    }
    if (isNaN(dataCheckOut.getTime())) {
      console.error('ERRO: Data de check-out inválida:', checkOut);
      return res.status(400).json({ error: 'Data de check-out inválida' });
    }
    if (dataCheckOut <= dataCheckIn) {
      console.error('ERRO: Check-out deve ser após check-in');
      return res.status(400).json({ error: 'Data de check-out deve ser após check-in' });
    }

    // Verificar se alguma data está bloqueada
    console.log('Verificando bloqueios nas datas...');
    try {
      const bloqueios = await prisma.bloqueio.findMany({
        where: {
          data: {
            gte: dataCheckIn,
            lte: dataCheckOut,
          },
        },
      });

      if (bloqueios.length > 0) {
        console.error('ERRO: Período contém datas bloqueadas');
        const datasBloqueadas = bloqueios.map((b: any) => {
          const data = new Date(b.data);
          return data.toLocaleDateString('pt-BR');
        }).join(', ');
        return res.status(400).json({ 
          error: 'Período não disponível',
          details: `As seguintes datas estão bloqueadas: ${datasBloqueadas}`
        });
      }
    } catch (bloqueioError: any) {
      console.error('ERRO ao verificar bloqueios:', bloqueioError);
      // Se houver erro ao verificar bloqueios, continuar mesmo assim
      // (não bloquear criação de reserva por erro na verificação)
      console.warn('⚠ Continuando criação de reserva mesmo com erro na verificação de bloqueios');
    }

    console.log('Validações passadas. Tentando criar reserva no banco...');

    try {
    const reserva = await prisma.reserva.create({
      data: {
        nome: nome.trim(),
        telefone: telefone.trim(),
        qtdPessoas: qtdPessoas || 1,
        checkIn: dataCheckIn,
        checkOut: dataCheckOut,
        valorTotal: parseFloat(valorTotal.toString()),
        observacoes: observacoes?.trim() || null,
        quarto: (req.body as any).quarto || 'Quarto 1',
        status: 'pendente',
      },
    });

      console.log('✓ RESERVA CRIADA COM SUCESSO NO BANCO!');
      console.log('ID da reserva:', reserva.id);
      console.log('Dados da reserva:', JSON.stringify(reserva, null, 2));

      return res.status(201).json(reserva);
    } catch (dbError: any) {
      console.error('ERRO AO SALVAR NO BANCO:', dbError);
      console.error('Código do erro:', dbError.code);
      console.error('Mensagem:', dbError.message);
      
      // Tratar erros específicos do Prisma
      if (dbError.code === 'P1001' || dbError.code === 'P2002') {
        return res.status(503).json({ 
          error: 'Banco de dados não disponível',
          details: 'Não foi possível conectar ao banco de dados. Tente novamente mais tarde.'
        });
      }
      
      if (dbError.code === 'P2002') {
        return res.status(400).json({ 
          error: 'Erro ao criar reserva',
          details: 'Já existe uma reserva com esses dados.'
        });
      }

      throw dbError; // Re-lançar para ser capturado pelo catch externo
    }
  } catch (error: any) {
    console.error('ERRO GERAL AO CRIAR RESERVA:', error);
    console.error('Stack:', error.stack);
    console.error('Tipo do erro:', error.constructor.name);
    
    // Garantir que sempre retornamos uma resposta JSON válida
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Erro ao criar reserva',
        details: error.message || 'Erro desconhecido. Verifique os logs do servidor.',
        code: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};

export const listarReservas = async (req: Request, res: Response) => {
  try {
    console.log('=== GET /reservas CHAMADO ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Query params:', req.query);
    console.log('Headers:', {
      authorization: req.headers.authorization ? 'Presente' : 'Ausente',
      'content-type': req.headers['content-type'],
    });

    const { status } = req.query;
    console.log('Filtro de status:', status || 'nenhum');

    const where = status ? { status: status as string } : {};

    console.log('Executando query no banco...');
    const reservas = await prisma.reserva.findMany({
      where,
      orderBy: { checkIn: 'asc' },
    });

    console.log(`✓ ${reservas.length} reserva(s) encontrada(s) no banco`);
    console.log('Enviando resposta JSON...');
    const response = res.json(reservas);
    console.log('✓ Resposta enviada com sucesso');
    return response;
  } catch (error: any) {
    console.error('ERRO GERAL AO LISTAR RESERVAS:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

export const obterReserva = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id: parseInt(id) },
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    return res.json(reserva);
  } catch (error: any) {
    console.error('Erro ao obter reserva:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const atualizarStatus = async (
  req: Request<{ id: string }, {}, UpdateStatusRequest>,
  res: Response
) => {
  try {
    console.log('=== TENTATIVA DE ATUALIZAR STATUS ===');
    console.log('ID recebido:', req.params.id);
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));

    const { id } = req.params;
    const { status } = req.body;

    // Validação do ID
    if (!id || id.trim() === '') {
      console.error('ERRO: ID não fornecido');
      return res.status(400).json({ error: 'ID da reserva é obrigatório' });
    }

    const reservaId = parseInt(id);
    if (isNaN(reservaId) || reservaId <= 0) {
      console.error('ERRO: ID inválido:', id);
      return res.status(400).json({ error: 'ID da reserva inválido' });
    }

    // Validação do status
    if (!status || status.trim() === '') {
      console.error('ERRO: Status não fornecido');
      return res.status(400).json({ error: 'Status é obrigatório' });
    }

    const statusValidos = ['pendente', 'confirmada', 'cancelada'];
    const statusNormalizado = status.toLowerCase().trim();
    
    if (!statusValidos.includes(statusNormalizado)) {
      console.error('ERRO: Status inválido:', status);
      return res.status(400).json({ 
        error: 'Status inválido',
        details: `Status deve ser um dos seguintes: ${statusValidos.join(', ')}`,
        statusRecebido: status
      });
    }

    console.log(`Tentando atualizar reserva ${reservaId} para status: ${statusNormalizado}`);

    // Verificar se a reserva existe
    const reservaExistente = await prisma.reserva.findUnique({
      where: { id: reservaId },
    });

    if (!reservaExistente) {
      console.error(`✗ Reserva ${reservaId} não encontrada no banco`);
      return res.status(404).json({ 
        error: 'Reserva não encontrada',
        details: `Nenhuma reserva encontrada com ID ${reservaId}`
      });
    }

    // Atualizar no banco
    console.log(`Executando query UPDATE: WHERE id = ${reservaId}, SET status = '${statusNormalizado}'`);
    const reserva = await prisma.reserva.update({
      where: { id: reservaId },
      data: { status: statusNormalizado },
    });

    console.log(`✓ Status da reserva ${reservaId} atualizado no banco para: ${statusNormalizado}`);
    console.log('Reserva atualizada:', JSON.stringify(reserva, null, 2));
    console.log(`Status confirmado no banco: ${reserva.status}`);

    // Verificar se realmente foi atualizado
    const reservaVerificada = await prisma.reserva.findUnique({
      where: { id: reservaId },
      select: { id: true, status: true },
    });
    
    if (reservaVerificada && reservaVerificada.status === statusNormalizado) {
      console.log(`✓ Verificação: Status confirmado no banco como '${reservaVerificada.status}'`);
    } else {
      console.warn(`⚠ AVISO: Status no banco pode estar diferente. Esperado: '${statusNormalizado}', Encontrado: '${reservaVerificada?.status}'`);
    }

    return res.json(reserva);
  } catch (error: any) {
    console.error('ERRO GERAL AO ATUALIZAR STATUS:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

export const deletarReserva = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    console.log('=== DELETE /reservas/:id CHAMADO ===');
    const { id } = req.params;
    console.log('ID recebido:', id);

    // Validação do ID
    if (!id || id.trim() === '') {
      console.error('ERRO: ID não fornecido');
      return res.status(400).json({ error: 'ID da reserva é obrigatório' });
    }

    const reservaId = parseInt(id);
    if (isNaN(reservaId) || reservaId <= 0) {
      console.error('ERRO: ID inválido:', id);
      return res.status(400).json({ error: 'ID da reserva inválido' });
    }

    console.log(`Tentando deletar reserva ${reservaId}...`);

    // Verificar se a reserva existe antes de deletar
    const reservaExistente = await prisma.reserva.findUnique({
      where: { id: reservaId },
    });

    if (!reservaExistente) {
      console.error(`✗ Reserva ${reservaId} não encontrada no banco`);
      return res.status(404).json({ 
        error: 'Reserva não encontrada',
        details: `Nenhuma reserva encontrada com ID ${reservaId}`
      });
    }

    // Deletar do banco
    await prisma.reserva.delete({
      where: { id: reservaId },
    });

    console.log(`✓ Reserva ${reservaId} deletada do banco com sucesso`);
    return res.status(204).send();
  } catch (error: any) {
    console.error('ERRO GERAL ao deletar reserva:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor', 
      details: error.message 
    });
  }
};

export const gerarMensagemWhatsApp = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    console.log('=== GERANDO MENSAGEM WHATSAPP ===');
    const { id } = req.params;
    console.log('ID da reserva:', id);

    // Buscar nome da hospedagem
    const hospedagem = await prisma.hospedagem.findFirst();
    const nomeHospedagem = hospedagem?.nome || 'nossa hospedagem';
    console.log('Nome da hospedagem encontrado:', nomeHospedagem);

    // Buscar reserva no banco
    console.log('Tentando buscar reserva no banco...');
    const reserva = await prisma.reserva.findUnique({
      where: { id: parseInt(id) },
    });
    console.log('Reserva encontrada no banco:', reserva ? 'Sim' : 'Não');

    if (!reserva) {
      console.error('✗ Reserva não encontrada no banco');
      return res.status(404).json({ 
        error: 'Reserva não encontrada',
        details: `Nenhuma reserva encontrada com ID ${id}.`
      });
    }

    console.log('Dados da reserva:', JSON.stringify(reserva, null, 2));
    console.log('Status da reserva:', reserva.status);

    // Gerar mensagem
    const mensagem = gerarMensagemConfirmacao(reserva, nomeHospedagem);
    console.log('✓ Mensagem gerada com sucesso');
    console.log('Mensagem:', mensagem);

    return res.json({ 
      mensagem,
      telefone: reserva.telefone || null,
      nome: reserva.nome,
      status: reserva.status
    });
  } catch (error: any) {
    console.error('ERRO GERAL ao gerar mensagem WhatsApp:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor', 
      details: error.message 
    });
  }
};



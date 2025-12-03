import { Request, Response } from 'express';
import { obterCalendarioMes } from '../services/calendarioService';

export const obterCalendario = async (req: Request, res: Response) => {
  try {
    console.log('=== GET /calendario CHAMADO ===');
    const { ano, mes } = req.query;
    console.log('Ano:', ano, 'Mês:', mes);

    if (!ano || !mes) {
      console.error('ERRO: Ano ou mês não fornecido');
      return res.status(400).json({ error: 'Ano e mês são obrigatórios' });
    }

    const anoNum = parseInt(ano as string);
    const mesNum = parseInt(mes as string);

    if (isNaN(anoNum) || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
      console.error('ERRO: Ano ou mês inválido');
      return res.status(400).json({ error: 'Ano e mês devem ser números válidos' });
    }

    console.log('Buscando calendário para:', anoNum, mesNum);
    const calendario = await obterCalendarioMes(anoNum, mesNum);
    console.log(`✓ Calendário gerado com ${calendario.length} dias`);

    // Converter datas para ISO string para o frontend
    const calendarioFormatado = calendario.map(dia => ({
      data: dia.data.toISOString(),
      status: dia.status,
      reservas: dia.reservas ? dia.reservas.map((r: any) => ({
        id: r.id,
        nome: r.nome,
        telefone: r.telefone,
        checkIn: r.checkIn instanceof Date ? r.checkIn.toISOString() : r.checkIn,
        checkOut: r.checkOut instanceof Date ? r.checkOut.toISOString() : r.checkOut,
        valorTotal: r.valorTotal,
        status: r.status,
      })) : undefined,
    }));

    return res.json(calendarioFormatado);
  } catch (error: any) {
    console.error('ERRO ao obter calendário:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};



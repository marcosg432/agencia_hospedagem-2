import { Request, Response } from 'express';
import { gerarRelatorioMes } from '../services/relatorioService';

export const obterRelatorio = async (req: Request, res: Response) => {
  try {
    console.log('=== GET /relatorios CHAMADO ===');
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

    console.log('Gerando relatório para:', anoNum, mesNum);
    const relatorio = await gerarRelatorioMes(anoNum, mesNum);
    console.log('✓ Relatório gerado com sucesso');

    return res.json(relatorio);
  } catch (error: any) {
    console.error('ERRO ao gerar relatório:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};



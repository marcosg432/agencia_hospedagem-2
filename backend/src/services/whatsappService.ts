import { Reserva } from '@prisma/client';

interface ReservaCompleta {
  id?: number;
  nome: string;
  telefone?: string;
  qtdPessoas?: number;
  checkIn: Date | string;
  checkOut: Date | string;
  valorTotal?: number;
  status: string;
  observacoes?: string | null;
}

export function gerarMensagemConfirmacao(reserva: ReservaCompleta, nomeHospedagem: string = 'nossa hospedagem'): string {
  try {
    console.log('[WHATSAPP] Gerando mensagem de confirmação');
    console.log('[WHATSAPP] Reserva recebida:', JSON.stringify(reserva, null, 2));
    console.log('[WHATSAPP] Nome da hospedagem:', nomeHospedagem);

    // Validar campos obrigatórios
    if (!reserva.nome) {
      console.error('[WHATSAPP] ERRO: Nome não fornecido');
      return 'Olá! Sua reserva está confirmada. Qualquer dúvida estou à disposição!';
    }

    if (!reserva.checkIn || !reserva.checkOut) {
      console.error('[WHATSAPP] ERRO: Datas não fornecidas');
      return `Olá ${reserva.nome}! Sua reserva está confirmada. Qualquer dúvida estou à disposição!`;
    }

    // Formatar datas
    const checkIn = new Date(reserva.checkIn);
    const checkOut = new Date(reserva.checkOut);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      console.error('[WHATSAPP] ERRO: Datas inválidas');
      return `Olá ${reserva.nome}! Sua reserva está confirmada. Qualquer dúvida estou à disposição!`;
    }

    const checkInFormatado = checkIn.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const checkOutFormatado = checkOut.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });

    // Gerar mensagem baseada no status
    let mensagem = '';
    
    if (reserva.status === 'confirmada') {
      mensagem = `Olá ${reserva.nome}! Sua reserva na ${nomeHospedagem} está *confirmada* para os dias ${checkInFormatado} a ${checkOutFormatado}.`;
      
      if (reserva.qtdPessoas) {
        mensagem += `\n\n👥 ${reserva.qtdPessoas} pessoa(s)`;
      }
      
      if (reserva.valorTotal) {
        mensagem += `\n💰 Valor total: R$ ${reserva.valorTotal.toFixed(2)}`;
      }
      
      mensagem += `\n\nQualquer dúvida estou à disposição!`;
    } else if (reserva.status === 'pendente') {
      mensagem = `Olá ${reserva.nome}! Recebemos sua solicitação de reserva na ${nomeHospedagem} para os dias ${checkInFormatado} a ${checkOutFormatado}.`;
      mensagem += `\n\nPode confirmar?`;
    } else if (reserva.status === 'cancelada') {
      mensagem = `Olá ${reserva.nome}! Sua reserva na ${nomeHospedagem} para os dias ${checkInFormatado} a ${checkOutFormatado} foi cancelada.`;
      mensagem += `\n\nSe precisar de mais alguma coisa, estou à disposição!`;
    } else {
      // Status desconhecido, mensagem genérica
      mensagem = `Olá ${reserva.nome}! Sua reserva na ${nomeHospedagem} para os dias ${checkInFormatado} a ${checkOutFormatado}.`;
      mensagem += `\n\nQualquer dúvida estou à disposição!`;
    }

    console.log('[WHATSAPP] Mensagem gerada:', mensagem);
    return mensagem;
  } catch (error: any) {
    console.error('[WHATSAPP] ERRO ao gerar mensagem:', error);
    return `Olá ${reserva.nome || 'cliente'}! Qualquer dúvida sobre sua reserva estou à disposição!`;
  }
}

export function gerarMensagemLembrete(reserva: ReservaCompleta, nomeHospedagem: string = 'nossa hospedagem'): string {
  try {
    if (!reserva.nome || !reserva.checkIn) {
      return 'Olá! Este é um lembrete sobre sua reserva. Aguardamos você!';
    }

    const checkIn = new Date(reserva.checkIn);
    const checkInFormatado = checkIn.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    return `Olá ${reserva.nome}! Este é um lembrete: sua reserva na ${nomeHospedagem} está confirmada para ${checkInFormatado}. Aguardamos você!`;
  } catch (error: any) {
    console.error('[WHATSAPP] ERRO ao gerar lembrete:', error);
    return 'Olá! Este é um lembrete sobre sua reserva. Aguardamos você!';
  }
}



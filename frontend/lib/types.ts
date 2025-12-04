export interface Reserva {
  id: number;
  nome: string;
  telefone: string;
  qtdPessoas: number;
  checkIn: string;
  checkOut: string;
  valorTotal: number;
  status: string;
  quarto?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hospedagem {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  capacidadeMax: number;
  fotos: string[];
  descricao?: string;
}

export interface Preco {
  id: number;
  tipo: string;
  valor: number;
  descricao?: string;
  dataEspecial?: string;
}

export interface Quarto {
  id: number;
  nome: string;
  precoBase: number; // Preço base do quarto (dias úteis)
  precoFimSemana?: number; // Preço adicional para fim de semana (opcional, se não informado usa ajuste da tabela)
  capacidade: number;
  descricao?: string;
  comodidades?: string[];
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bloqueio {
  id: number;
  data: string;
  motivo: string;
}

export interface DiaCalendario {
  data: string;
  status: 'livre' | 'ocupado' | 'bloqueado';
  reservas?: Reserva[];
}

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




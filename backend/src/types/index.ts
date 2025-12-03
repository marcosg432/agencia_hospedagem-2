export interface LoginRequest {
  email: string;
  senha: string;
}

export interface ReservaRequest {
  nome: string;
  telefone: string;
  qtdPessoas: number;
  checkIn: string;
  checkOut: string;
  valorTotal: number;
  observacoes?: string;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface BloqueioRequest {
  data: string;
  motivo: string;
}

export interface PrecoRequest {
  tipo: string;
  valor: number;
  descricao?: string;
  dataEspecial?: string;
}

export interface HospedagemRequest {
  nome: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  capacidadeMax: number;
  fotos: string[];
  descricao?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}





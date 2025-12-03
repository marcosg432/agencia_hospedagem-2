// Serviço de reservas em memória (fallback quando banco não está disponível)
import { ReservaRequest } from '../types';

interface ReservaMemory {
  id: number;
  nome: string;
  telefone: string;
  qtdPessoas: number;
  checkIn: Date;
  checkOut: Date;
  valorTotal: number;
  status: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

let reservasMemory: ReservaMemory[] = [];
let nextId = 1;

export const criarReservaMemory = (data: ReservaRequest): ReservaMemory => {
  const reserva: ReservaMemory = {
    id: nextId++,
    nome: data.nome,
    telefone: data.telefone,
    qtdPessoas: data.qtdPessoas || 1,
    checkIn: new Date(data.checkIn),
    checkOut: new Date(data.checkOut),
    valorTotal: data.valorTotal,
    status: 'pendente',
    observacoes: data.observacoes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  reservasMemory.push(reserva);
  console.log('✓ Reserva criada em memória (fallback)');
  return reserva;
};

export const listarReservasMemory = (status?: string): ReservaMemory[] => {
  if (status) {
    return reservasMemory.filter(r => r.status === status);
  }
  return reservasMemory;
};

export const atualizarStatusMemory = (id: number, status: string): ReservaMemory | null => {
  const reserva = reservasMemory.find(r => r.id === id);
  if (reserva) {
    reserva.status = status;
    reserva.updatedAt = new Date();
    return reserva;
  }
  return null;
};

export const deletarReservaMemory = (id: number): boolean => {
  const index = reservasMemory.findIndex(r => r.id === id);
  if (index !== -1) {
    reservasMemory.splice(index, 1);
    return true;
  }
  return false;
};

export const obterReservaMemory = (id: number): ReservaMemory | null => {
  return reservasMemory.find(r => r.id === id) || null;
};




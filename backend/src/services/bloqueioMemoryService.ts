// Serviço de bloqueios em memória (fallback quando banco não está disponível)

interface BloqueioMemory {
  id: number;
  data: Date;
  motivo: string;
  createdAt: Date;
}

let bloqueiosMemory: BloqueioMemory[] = [];
let nextId = 1;

export const criarBloqueioMemory = (data: Date, motivo: string): BloqueioMemory => {
  // Verificar se já existe bloqueio para esta data
  const dataStr = data.toISOString().split('T')[0];
  const existe = bloqueiosMemory.some(b => b.data.toISOString().split('T')[0] === dataStr);
  
  if (existe) {
    throw new Error('Data já está bloqueada');
  }

  const bloqueio: BloqueioMemory = {
    id: nextId++,
    data,
    motivo: motivo || 'limpeza',
    createdAt: new Date(),
  };
  
  bloqueiosMemory.push(bloqueio);
  console.log('✓ Bloqueio criado em memória (fallback)');
  return bloqueio;
};

export const listarBloqueiosMemory = (ano?: number, mes?: number): BloqueioMemory[] => {
  let bloqueios = bloqueiosMemory;
  
  if (ano && mes) {
    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = new Date(ano, mes, 0);
    
    bloqueios = bloqueiosMemory.filter(b => {
      const dataBloqueio = new Date(b.data);
      return dataBloqueio >= primeiroDia && dataBloqueio <= ultimoDia;
    });
  }
  
  return bloqueios.sort((a, b) => a.data.getTime() - b.data.getTime());
};

export const deletarBloqueioMemory = (id: number): boolean => {
  const index = bloqueiosMemory.findIndex(b => b.id === id);
  if (index !== -1) {
    bloqueiosMemory.splice(index, 1);
    return true;
  }
  return false;
};

export const verificarDataBloqueada = (data: Date): boolean => {
  const dataStr = data.toISOString().split('T')[0];
  return bloqueiosMemory.some(b => b.data.toISOString().split('T')[0] === dataStr);
};




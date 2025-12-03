// Sistema de armazenamento temporário em JSON (enquanto PostgreSQL não está disponível)
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const RESERVAS_FILE = path.join(DATA_DIR, 'reservas.json');
const BLOQUEIOS_FILE = path.join(DATA_DIR, 'bloqueios.json');
const PRECOS_FILE = path.join(DATA_DIR, 'precos.json');
const QUARTOS_FILE = path.join(DATA_DIR, 'quartos.json');

// Garantir que o diretório existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializar arquivos se não existirem
if (!fs.existsSync(RESERVAS_FILE)) {
  fs.writeFileSync(RESERVAS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(BLOQUEIOS_FILE)) {
  fs.writeFileSync(BLOQUEIOS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(PRECOS_FILE)) {
  // Inicializar com preços padrão
  const precosIniciais = [
    { id: 1, tipo: 'comum', valor: 150, descricao: 'Preço padrão', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, tipo: 'fim_semana', valor: 200, descricao: 'Preço fim de semana', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  fs.writeFileSync(PRECOS_FILE, JSON.stringify(precosIniciais, null, 2));
}

if (!fs.existsSync(QUARTOS_FILE)) {
  // Inicializar com quartos padrão
  const quartosIniciais = [
    { id: 1, nome: 'Quarto Standard', precoBase: 150, capacidade: 2, descricao: 'Quarto confortável com Wi-Fi, ar-condicionado e TV', comodidades: ['Wi-Fi', 'Ar-condicionado', 'TV'], ativo: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, nome: 'Quarto Deluxe', precoBase: 250, capacidade: 2, descricao: 'Quarto com vista para o mar e café da manhã', comodidades: ['Wi-Fi', 'Ar-condicionado', 'TV', 'Vista para o mar', 'Café da manhã'], ativo: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, nome: 'Suíte Master', precoBase: 350, capacidade: 4, descricao: 'Suíte espaçosa com hidromassagem', comodidades: ['Wi-Fi', 'Ar-condicionado', 'TV', 'Vista para o mar', 'Café da manhã', 'Hidromassagem'], ativo: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, nome: 'Quarto Familiar', precoBase: 300, capacidade: 5, descricao: 'Ideal para famílias', comodidades: ['Wi-Fi', 'Ar-condicionado', 'TV', 'Café da manhã'], ativo: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 5, nome: 'Quarto Presidencial', precoBase: 500, capacidade: 2, descricao: 'Quarto de luxo com varanda privativa', comodidades: ['Wi-Fi', 'Ar-condicionado', 'TV', 'Vista para o mar', 'Café da manhã', 'Hidromassagem', 'Varanda privativa'], ativo: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 6, nome: 'Quarto Econômico', precoBase: 100, capacidade: 1, descricao: 'Quarto simples e econômico', comodidades: ['Wi-Fi', 'Ventilador'], ativo: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  fs.writeFileSync(QUARTOS_FILE, JSON.stringify(quartosIniciais, null, 2));
}

export const storage = {
  // RESERVAS
  getReservas: (): any[] => {
    try {
      const data = fs.readFileSync(RESERVAS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler reservas:', error);
      return [];
    }
  },

  saveReserva: (reserva: any): any => {
    try {
      const reservas = storage.getReservas();
      const novaReserva = {
        ...reserva,
        id: reservas.length > 0 ? Math.max(...reservas.map((r: any) => r.id || 0)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      reservas.push(novaReserva);
      fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
      console.log(`[STORAGE] Reserva salva: ID ${novaReserva.id}`);
      return novaReserva;
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      throw error;
    }
  },

  updateReserva: (id: number, updates: any): any | null => {
    try {
      const reservas = storage.getReservas();
      const index = reservas.findIndex((r: any) => r.id === id);
      if (index === -1) return null;
      
      reservas[index] = {
        ...reservas[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
      console.log(`[STORAGE] Reserva atualizada: ID ${id}`);
      return reservas[index];
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      return null;
    }
  },

  deleteReserva: (id: number): boolean => {
    try {
      const reservas = storage.getReservas();
      const filtered = reservas.filter((r: any) => r.id !== id);
      if (filtered.length === reservas.length) return false;
      
      fs.writeFileSync(RESERVAS_FILE, JSON.stringify(filtered, null, 2));
      console.log(`[STORAGE] Reserva deletada: ID ${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      return false;
    }
  },

  // BLOQUEIOS
  getBloqueios: (): any[] => {
    try {
      const data = fs.readFileSync(BLOQUEIOS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler bloqueios:', error);
      return [];
    }
  },

  saveBloqueio: (bloqueio: any): any => {
    try {
      const bloqueios = storage.getBloqueios();
      const novoBloqueio = {
        ...bloqueio,
        id: bloqueios.length > 0 ? Math.max(...bloqueios.map((b: any) => b.id || 0)) + 1 : 1,
        createdAt: new Date().toISOString(),
      };
      bloqueios.push(novoBloqueio);
      fs.writeFileSync(BLOQUEIOS_FILE, JSON.stringify(bloqueios, null, 2));
      console.log(`[STORAGE] Bloqueio salvo: ID ${novoBloqueio.id}`);
      return novoBloqueio;
    } catch (error) {
      console.error('Erro ao salvar bloqueio:', error);
      throw error;
    }
  },

  deleteBloqueio: (id: number): boolean => {
    try {
      const bloqueios = storage.getBloqueios();
      const filtered = bloqueios.filter((b: any) => b.id !== id);
      if (filtered.length === bloqueios.length) return false;
      
      fs.writeFileSync(BLOQUEIOS_FILE, JSON.stringify(filtered, null, 2));
      console.log(`[STORAGE] Bloqueio deletado: ID ${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar bloqueio:', error);
      return false;
    }
  },

  // PREÇOS
  getPrecos: (): any[] => {
    try {
      const data = fs.readFileSync(PRECOS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler preços:', error);
      return [];
    }
  },

  savePreco: (preco: any): any => {
    try {
      const precos = storage.getPrecos();
      // Verificar se já existe preço com o mesmo tipo
      const existe = precos.find((p: any) => p.tipo === preco.tipo);
      if (existe) {
        throw new Error('Tipo de preço já existe');
      }
      
      const novoPreco = {
        ...preco,
        id: precos.length > 0 ? Math.max(...precos.map((p: any) => p.id || 0)) + 1 : 1,
        valor: parseFloat(preco.valor), // Garantir que é número
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      precos.push(novoPreco);
      fs.writeFileSync(PRECOS_FILE, JSON.stringify(precos, null, 2));
      console.log(`[STORAGE] Preço salvo: ID ${novoPreco.id}, Tipo: ${novoPreco.tipo}, Valor: ${novoPreco.valor}`);
      return novoPreco;
    } catch (error) {
      console.error('Erro ao salvar preço:', error);
      throw error;
    }
  },

  updatePreco: (id: number, updates: any): any | null => {
    try {
      const precos = storage.getPrecos();
      const index = precos.findIndex((p: any) => p.id === id);
      if (index === -1) return null;
      
      // Se está tentando mudar o tipo, verificar se não existe outro com o mesmo tipo
      if (updates.tipo && updates.tipo !== precos[index].tipo) {
        const existe = precos.find((p: any) => p.tipo === updates.tipo && p.id !== id);
        if (existe) {
          throw new Error('Tipo de preço já existe');
        }
      }
      
      precos[index] = {
        ...precos[index],
        ...updates,
        id,
        valor: updates.valor !== undefined ? parseFloat(updates.valor) : precos[index].valor, // Garantir que é número
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(PRECOS_FILE, JSON.stringify(precos, null, 2));
      console.log(`[STORAGE] Preço atualizado: ID ${id}, Tipo: ${precos[index].tipo}, Valor: ${precos[index].valor}`);
      return precos[index];
    } catch (error) {
      console.error('Erro ao atualizar preço:', error);
      throw error;
    }
  },

  // QUARTOS
  getQuartos: (): any[] => {
    try {
      if (!fs.existsSync(QUARTOS_FILE)) {
        return [];
      }
      const data = fs.readFileSync(QUARTOS_FILE, 'utf-8');
      const quartos = JSON.parse(data);
      return Array.isArray(quartos) ? quartos.filter((q: any) => q.ativo !== false) : [];
    } catch (error) {
      console.error('Erro ao ler quartos:', error);
      return [];
    }
  },

  getQuarto: (id: number): any | null => {
    try {
      const quartos = storage.getQuartos();
      return quartos.find((q: any) => q.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar quarto:', error);
      return null;
    }
  },

  getQuartoPorNome: (nome: string): any | null => {
    try {
      const quartos = storage.getQuartos();
      return quartos.find((q: any) => q.nome === nome) || null;
    } catch (error) {
      console.error('Erro ao buscar quarto por nome:', error);
      return null;
    }
  },

  saveQuarto: (quarto: any): any => {
    try {
      const quartos = storage.getQuartos();
      // Verificar se já existe quarto com o mesmo nome
      const existe = quartos.find((q: any) => q.nome === quarto.nome);
      if (existe) {
        throw new Error('Quarto com este nome já existe');
      }
      
      const novoQuarto = {
        ...quarto,
        id: quartos.length > 0 ? Math.max(...quartos.map((q: any) => q.id || 0)) + 1 : 1,
        precoBase: parseFloat(quarto.precoBase),
        precoFimSemana: quarto.precoFimSemana ? parseFloat(quarto.precoFimSemana) : undefined,
        ativo: quarto.ativo !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      quartos.push(novoQuarto);
      fs.writeFileSync(QUARTOS_FILE, JSON.stringify(quartos, null, 2));
      console.log(`[STORAGE] Quarto salvo: ID ${novoQuarto.id}, Nome: ${novoQuarto.nome}, Preço Base: ${novoQuarto.precoBase}`);
      return novoQuarto;
    } catch (error) {
      console.error('Erro ao salvar quarto:', error);
      throw error;
    }
  },

  updateQuarto: (id: number, updates: any): any | null => {
    try {
      const quartos = storage.getQuartos();
      const index = quartos.findIndex((q: any) => q.id === id);
      if (index === -1) return null;
      
      // Se está tentando mudar o nome, verificar se não existe outro com o mesmo nome
      if (updates.nome && updates.nome !== quartos[index].nome) {
        const existe = quartos.find((q: any) => q.nome === updates.nome && q.id !== id);
        if (existe) {
          throw new Error('Quarto com este nome já existe');
        }
      }
      
      quartos[index] = {
        ...quartos[index],
        ...updates,
        id,
        precoBase: updates.precoBase !== undefined ? parseFloat(updates.precoBase) : quartos[index].precoBase,
        precoFimSemana: updates.precoFimSemana !== undefined ? (updates.precoFimSemana ? parseFloat(updates.precoFimSemana) : undefined) : quartos[index].precoFimSemana,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(QUARTOS_FILE, JSON.stringify(quartos, null, 2));
      console.log(`[STORAGE] Quarto atualizado: ID ${id}, Nome: ${quartos[index].nome}, Preço Base: ${quartos[index].precoBase}`);
      return quartos[index];
    } catch (error) {
      console.error('Erro ao atualizar quarto:', error);
      throw error;
    }
  },
};



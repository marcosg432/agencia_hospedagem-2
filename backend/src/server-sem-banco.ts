// Versão temporária do servidor que permite iniciar sem banco (apenas para testes)
// NÃO USE EM PRODUÇÃO!
// Esta versão apenas testa comunicação - não salva dados

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { storage } from './storage-json';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// Configuração CORS
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins: string[] = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_API_URL?.replace('/api', ''),
    ].filter((url): url is string => Boolean(url));
    
    // Permitir localhost em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // Verificar se origin está na lista
    if (allowedOrigins.some((allowed: string) => origin?.includes(allowed.replace(/^https?:\/\//, '')))) {
      return callback(null, true);
    }
    
    // Em produção, permitir apenas origens configuradas
    if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
      const frontendUrl = new URL(process.env.FRONTEND_URL);
      if (origin === frontendUrl.origin || origin === `https://${frontendUrl.hostname}` || origin === `http://${frontendUrl.hostname}`) {
        return callback(null, true);
      }
    }
    
    // Por segurança, em produção sem FRONTEND_URL definido, rejeitar
    if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
      console.warn('[CORS] ⚠ Origin não permitida em produção:', origin);
      return callback(null, true); // Permitir temporariamente para facilitar deploy
    }
    
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin || 'N/A');
  next();
});

// ===== ROTA DE AUTENTICAÇÃO =====
app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Credenciais padrão para modo sem banco
  if (email === 'admin@admin.com' && senha === 'admin123') {
    const jwtSecret = process.env.JWT_SECRET || 'jwt-secret-temporario';
    const token = jwt.sign(
      { userId: 1, email: 'admin@admin.com', role: 'admin' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return res.json({ 
      token,
      user: {
        id: 1,
        email: 'admin@admin.com',
        nome: 'Administrador',
        role: 'admin',
      },
    });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

// ===== ROTAS DE RESERVAS =====
// Listar reservas (GET /api/reservas) - DEVE VIR ANTES DAS ROTAS COM PARÂMETROS
app.get('/api/reservas', (req, res) => {
  console.log('[RESERVAS] GET /api/reservas - Listando reservas (armazenamento JSON)');
  console.log('Query params:', req.query);
  
  try {
    let reservas = storage.getReservas();
    
    // Filtrar por status se fornecido
    if (req.query.status) {
      reservas = reservas.filter((r: any) => r.status === req.query.status);
    }
    
    // Filtrar por quarto se fornecido
    if (req.query.quarto) {
      reservas = reservas.filter((r: any) => r.quarto === req.query.quarto);
    }
    
    console.log(`[RESERVAS] Retornando ${reservas.length} reserva(s)`);
    res.json(reservas);
  } catch (error: any) {
    console.error('[RESERVAS] Erro ao listar:', error);
    res.status(500).json({ error: 'Erro ao listar reservas', details: error.message });
  }
});

// Criar reserva (POST /api/reservas)
app.post('/api/reservas', (req, res) => {
  console.log('=== TENTATIVA DE CRIAR RESERVA (ARMAZENAMENTO JSON) ===');
  console.log('Body recebido:', JSON.stringify(req.body, null, 2));
  
  try {
    const { nome, telefone, qtdPessoas, checkIn, checkOut, valorTotal, observacoes, quarto } = req.body;
    
    // Validação básica
    if (!nome || !telefone || !checkIn || !checkOut || !valorTotal) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, telefone, checkIn, checkOut, valorTotal' });
    }
    
    // Verificar conflitos com outras reservas (considerando o quarto)
    const reservas = storage.getReservas();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const quartoReserva = quarto || 'Quarto 1';
    
    const conflitos = reservas.filter((r: any) => {
      if (r.status === 'cancelada') return false;
      // Verificar se é o mesmo quarto
      const rQuarto = r.quarto || 'Quarto 1';
      if (rQuarto !== quartoReserva) return false;
      
      // Verificar conflito de datas
      const rCheckIn = new Date(r.checkIn);
      const rCheckOut = new Date(r.checkOut);
      return (checkInDate < rCheckOut && checkOutDate > rCheckIn);
    });
    
    if (conflitos.length > 0) {
      const conflito = conflitos[0];
      return res.status(400).json({ 
        error: 'Período não disponível',
        details: `O ${quartoReserva} já está reservado de ${new Date(conflito.checkIn).toLocaleDateString('pt-BR')} a ${new Date(conflito.checkOut).toLocaleDateString('pt-BR')}`
      });
    }
    
    // Verificar bloqueios no período
    const bloqueios = storage.getBloqueios();
    const bloqueiosConflitantes = bloqueios.filter((b: any) => {
      const dataBloqueio = new Date(b.data);
      return dataBloqueio >= checkInDate && dataBloqueio < checkOutDate;
    });
    
    if (bloqueiosConflitantes.length > 0) {
      const bloqueio = bloqueiosConflitantes[0];
      return res.status(400).json({ 
        error: 'Período não disponível',
        details: `Data bloqueada: ${new Date(bloqueio.data).toLocaleDateString('pt-BR')} (${bloqueio.motivo})`
      });
    }
    
    // Salvar reserva (garantir que o quarto seja salvo corretamente)
    // quartoReserva já foi declarado acima
    const novaReserva = storage.saveReserva({
      nome,
      telefone,
      qtdPessoas: qtdPessoas || 1,
      checkIn,
      checkOut,
      valorTotal,
      observacoes: observacoes || '',
      quarto: quartoReserva, // Garantir que o quarto seja salvo
      status: 'pendente',
    });
    
    console.log(`[RESERVAS] ✓ Reserva criada: ID ${novaReserva.id}, Quarto: ${novaReserva.quarto}`);
    
    console.log(`[RESERVAS] ✓ Reserva criada com sucesso: ID ${novaReserva.id}`);
    res.status(201).json(novaReserva);
  } catch (error: any) {
    console.error('[RESERVAS] Erro ao criar:', error);
    res.status(500).json({ error: 'Erro ao criar reserva', details: error.message });
  }
});

// Gerar mensagem WhatsApp (GET /api/reservas/:id/whatsapp) - DEVE VIR ANTES DE /api/reservas/:id
app.get('/api/reservas/:id/whatsapp', (req, res) => {
  console.log(`[RESERVAS] GET /api/reservas/${req.params.id}/whatsapp`);
  res.json({
    mensagem: 'Olá! Sua reserva foi confirmada. Detalhes: [modo sem banco]',
    warning: '⚠️ Modo sem banco - dados não são reais!'
  });
});

// Atualizar status (PUT /api/reservas/:id/status) - DEVE VIR ANTES DE /api/reservas/:id
app.put('/api/reservas/:id/status', (req, res) => {
  console.log(`[RESERVAS] PUT /api/reservas/${req.params.id}/status`);
  console.log('Novo status:', req.body.status);
  
  try {
    const id = parseInt(req.params.id);
    const atualizada = storage.updateReserva(id, { status: req.body.status });
    
    if (!atualizada) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    
    console.log(`[RESERVAS] ✓ Status atualizado: ID ${id} -> ${req.body.status}`);
    res.json(atualizada);
  } catch (error: any) {
    console.error('[RESERVAS] Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status', details: error.message });
  }
});

// Obter uma reserva (GET /api/reservas/:id)
app.get('/api/reservas/:id', (req, res) => {
  console.log(`[RESERVAS] GET /api/reservas/${req.params.id}`);
  
  try {
    const id = parseInt(req.params.id);
    const reservas = storage.getReservas();
    const reserva = reservas.find((r: any) => r.id === id);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    
    res.json(reserva);
  } catch (error: any) {
    console.error('[RESERVAS] Erro ao obter reserva:', error);
    res.status(500).json({ error: 'Erro ao obter reserva', details: error.message });
  }
});

// Deletar reserva (DELETE /api/reservas/:id)
app.delete('/api/reservas/:id', (req, res) => {
  console.log(`[RESERVAS] DELETE /api/reservas/${req.params.id}`);
  
  try {
    const id = parseInt(req.params.id);
    const deletada = storage.deleteReserva(id);
    
    if (!deletada) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    
    console.log(`[RESERVAS] ✓ Reserva deletada: ID ${id}`);
    res.json({ message: 'Reserva deletada com sucesso' });
  } catch (error: any) {
    console.error('[RESERVAS] Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro ao deletar reserva', details: error.message });
  }
});

// ===== ROTAS DE BLOQUEIOS =====
// Listar bloqueios (GET /api/bloqueios)
app.get('/api/bloqueios', (req, res) => {
  console.log('[BLOQUEIOS] GET /api/bloqueios - Listando bloqueios (armazenamento JSON)');
  
  try {
    const bloqueios = storage.getBloqueios();
    console.log(`[BLOQUEIOS] Retornando ${bloqueios.length} bloqueio(s)`);
    res.json(bloqueios);
  } catch (error: any) {
    console.error('[BLOQUEIOS] Erro ao listar:', error);
    res.status(500).json({ error: 'Erro ao listar bloqueios', details: error.message });
  }
});

// Criar bloqueio (POST /api/bloqueios)
app.post('/api/bloqueios', (req, res) => {
  console.log('=== TENTATIVA DE CRIAR BLOQUEIO (ARMAZENAMENTO JSON) ===');
  console.log('Body recebido:', JSON.stringify(req.body, null, 2));
  
  try {
    const { data, motivo } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }
    
    const novoBloqueio = storage.saveBloqueio({
      data,
      motivo: motivo || 'limpeza',
    });
    
    console.log(`[BLOQUEIOS] ✓ Bloqueio criado: ID ${novoBloqueio.id}`);
    res.status(201).json(novoBloqueio);
  } catch (error: any) {
    console.error('[BLOQUEIOS] Erro ao criar:', error);
    res.status(500).json({ error: 'Erro ao criar bloqueio', details: error.message });
  }
});

// Deletar bloqueio (DELETE /api/bloqueios/:id)
app.delete('/api/bloqueios/:id', (req, res) => {
  console.log(`[BLOQUEIOS] DELETE /api/bloqueios/${req.params.id}`);
  
  try {
    const id = parseInt(req.params.id);
    const deletado = storage.deleteBloqueio(id);
    
    if (!deletado) {
      return res.status(404).json({ error: 'Bloqueio não encontrado' });
    }
    
    console.log(`[BLOQUEIOS] ✓ Bloqueio deletado: ID ${id}`);
    res.json({ message: 'Bloqueio deletado com sucesso' });
  } catch (error: any) {
    console.error('[BLOQUEIOS] Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro ao deletar bloqueio', details: error.message });
  }
});

// ===== ROTAS DE RELATÓRIOS =====
app.get('/api/relatorios', (req, res) => {
  console.log('[RELATORIOS] GET /api/relatorios');
  const { ano, mes } = req.query;
  console.log(`Ano: ${ano}, Mês: ${mes}`);
  
  try {
    const reservas = storage.getReservas();
    const bloqueios = storage.getBloqueios();
    
    const anoFiltro = ano ? parseInt(ano as string) : new Date().getFullYear();
    const mesFiltro = mes ? parseInt(mes as string) : new Date().getMonth() + 1;
    
    // Filtrar reservas do mês/ano
    const reservasMes = reservas.filter((r: any) => {
      const data = new Date(r.checkIn);
      return data.getFullYear() === anoFiltro && data.getMonth() + 1 === mesFiltro;
    });
    
    const reservasConfirmadas = reservasMes.filter((r: any) => r.status === 'confirmada');
    const totalFaturado = reservasConfirmadas.reduce((sum: number, r: any) => sum + (r.valorTotal || 0), 0);
    
    // Calcular dias ocupados
    const diasOcupados = new Set();
    reservasMes.forEach((r: any) => {
      if (r.status !== 'cancelada') {
        const checkIn = new Date(r.checkIn);
        const checkOut = new Date(r.checkOut);
        for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
          diasOcupados.add(d.toISOString().split('T')[0]);
        }
      }
    });
    
    // Calcular dias bloqueados
    const diasBloqueados = new Set();
    bloqueios.forEach((b: any) => {
      const data = new Date(b.data);
      if (data.getFullYear() === anoFiltro && data.getMonth() + 1 === mesFiltro) {
        diasBloqueados.add(data.toISOString().split('T')[0]);
      }
    });
    
    const diasNoMes = new Date(anoFiltro, mesFiltro, 0).getDate();
    const taxaOcupacao = diasNoMes > 0 ? ((diasOcupados.size + diasBloqueados.size) / diasNoMes) * 100 : 0;
    
    res.json({
      ano: anoFiltro,
      mes: mesFiltro,
      reservasConfirmadas: reservasConfirmadas.length,
      totalReservas: reservasMes.length,
      totalFaturado,
      taxaOcupacao: Math.round(taxaOcupacao * 10) / 10,
      diasOcupados: diasOcupados.size,
      diasBloqueados: diasBloqueados.size,
    });
  } catch (error: any) {
    console.error('[RELATORIOS] Erro ao calcular:', error);
    res.status(500).json({ error: 'Erro ao calcular relatório', details: error.message });
  }
});

// ===== ROTA DE CALENDÁRIO =====
app.get('/api/calendario', (req, res) => {
  console.log('[CALENDARIO] GET /api/calendario');
  const { ano, mes } = req.query;
  console.log(`Ano: ${ano}, Mês: ${mes}`);
  
  try {
    if (!ano || !mes) {
      return res.status(400).json({ error: 'Ano e mês são obrigatórios' });
    }

    const anoNum = parseInt(ano as string);
    const mesNum = parseInt(mes as string);

    if (isNaN(anoNum) || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
      return res.status(400).json({ error: 'Ano e mês devem ser números válidos' });
    }

    const reservas = storage.getReservas();
    const bloqueios = storage.getBloqueios();
    
    const primeiroDia = new Date(anoNum, mesNum - 1, 1);
    const ultimoDia = new Date(anoNum, mesNum, 0);
    
    const dias: any[] = [];
    
    // Criar set de bloqueios para busca rápida
    const bloqueiosSet = new Set(
      bloqueios.map(b => {
        const dataBloqueio = b.data instanceof Date ? b.data : new Date(b.data);
        return dataBloqueio.toISOString().split('T')[0];
      })
    );
    
    // Filtrar reservas válidas (confirmadas ou pendentes)
    const reservasValidas = reservas.filter(r => {
      const status = r.status || 'pendente';
      return status === 'confirmada' || status === 'pendente';
    });
    
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const data = new Date(anoNum, mesNum - 1, dia);
      const dataStr = data.toISOString().split('T')[0];
      
      // Verificar se está bloqueado
      if (bloqueiosSet.has(dataStr)) {
        dias.push({
          data: data.toISOString(),
          status: 'bloqueado',
        });
        continue;
      }

      // Verificar se está ocupado
      const ocupado = reservasValidas.some(r => {
        const checkIn = new Date(r.checkIn);
        const checkOut = new Date(r.checkOut);
        return data >= checkIn && data < checkOut;
      });

      if (ocupado) {
        const reservasDoDia = reservasValidas.filter(r => {
          const checkIn = new Date(r.checkIn);
          const checkOut = new Date(r.checkOut);
          return data >= checkIn && data < checkOut;
        });

        dias.push({
          data: data.toISOString(),
          status: 'ocupado',
          reservas: reservasDoDia.map(r => ({
            id: r.id,
            nome: r.nome,
            telefone: r.telefone,
            checkIn: r.checkIn instanceof Date ? r.checkIn.toISOString() : r.checkIn,
            checkOut: r.checkOut instanceof Date ? r.checkOut.toISOString() : r.checkOut,
            valorTotal: r.valorTotal,
            status: r.status,
          })),
        });
      } else {
        dias.push({
          data: data.toISOString(),
          status: 'livre',
        });
      }
    }

    console.log(`[CALENDARIO] Retornando ${dias.length} dias`);
    res.json(dias);
  } catch (error: any) {
    console.error('[CALENDARIO] Erro ao gerar calendário:', error);
    res.status(500).json({ error: 'Erro ao gerar calendário', details: error.message });
  }
});

// ===== ROTAS DE PREÇOS =====
app.get('/api/precos', (req, res) => {
  console.log('[PREÇOS] GET /api/precos - Listando preços');
  try {
    const precos = storage.getPrecos();
    console.log(`[PREÇOS] Retornando ${precos.length} preço(s)`);
    res.json(precos);
  } catch (error: any) {
    console.error('[PREÇOS] Erro ao listar:', error);
    res.status(500).json({ error: 'Erro ao listar preços', details: error.message });
  }
});

app.post('/api/precos', (req, res) => {
  console.log('[PREÇOS] POST /api/precos - Criando preço');
  console.log('Body:', req.body);
  
  try {
    const { tipo, valor, descricao, dataEspecial } = req.body;
    
    // Validação
    if (!tipo || valor === undefined || valor === null) {
      return res.status(400).json({ error: 'Tipo e valor são obrigatórios' });
    }
    
    // Converter valor para número
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      return res.status(400).json({ error: 'Valor deve ser um número positivo' });
    }
    
    const novoPreco = storage.savePreco({
      tipo,
      valor: valorNumerico,
      descricao: descricao || null,
      dataEspecial: dataEspecial ? new Date(dataEspecial).toISOString() : null,
    });
    
    console.log('[PREÇOS] Preço criado com sucesso:', novoPreco);
    res.status(201).json(novoPreco);
  } catch (error: any) {
    console.error('[PREÇOS] Erro ao criar preço:', error);
    if (error.message === 'Tipo de preço já existe') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao criar preço', details: error.message });
  }
});

app.put('/api/precos/:id', (req, res) => {
  console.log('[PREÇOS] PUT /api/precos/:id - Atualizando preço');
  console.log('ID:', req.params.id);
  console.log('Body:', req.body);
  
  try {
    const { id } = req.params;
    const { tipo, valor, descricao, dataEspecial } = req.body;
    
    const idNumero = parseInt(id);
    if (isNaN(idNumero)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    // Validação
    if (valor !== undefined && valor !== null) {
      const valorNumerico = parseFloat(valor);
      if (isNaN(valorNumerico) || valorNumerico < 0) {
        return res.status(400).json({ error: 'Valor deve ser um número positivo' });
      }
    }
    
    const updates: any = {};
    if (tipo !== undefined) updates.tipo = tipo;
    if (valor !== undefined) updates.valor = parseFloat(valor);
    if (descricao !== undefined) updates.descricao = descricao || null;
    if (dataEspecial !== undefined) {
      updates.dataEspecial = dataEspecial ? new Date(dataEspecial).toISOString() : null;
    }
    
    const precoAtualizado = storage.updatePreco(idNumero, updates);
    
    if (!precoAtualizado) {
      return res.status(404).json({ error: 'Preço não encontrado' });
    }
    
    console.log('[PREÇOS] Preço atualizado com sucesso:', precoAtualizado);
    res.json(precoAtualizado);
  } catch (error: any) {
    console.error('[PREÇOS] Erro ao atualizar preço:', error);
    if (error.message === 'Tipo de preço já existe') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao atualizar preço', details: error.message });
  }
});

// ===== ROTAS DE QUARTOS =====
app.get('/api/quartos', (req, res) => {
  console.log('[QUARTOS] GET /api/quartos - Listando quartos');
  try {
    const quartos = storage.getQuartos();
    console.log(`[QUARTOS] Retornando ${quartos.length} quarto(s)`);
    res.json(quartos);
  } catch (error: any) {
    console.error('[QUARTOS] Erro ao listar:', error);
    res.status(500).json({ error: 'Erro ao listar quartos', details: error.message });
  }
});

app.get('/api/quartos/:id', (req, res) => {
  console.log('[QUARTOS] GET /api/quartos/:id');
  try {
    const { id } = req.params;
    const quarto = storage.getQuarto(parseInt(id));
    if (!quarto) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    res.json(quarto);
  } catch (error: any) {
    console.error('[QUARTOS] Erro ao buscar quarto:', error);
    res.status(500).json({ error: 'Erro ao buscar quarto', details: error.message });
  }
});

app.get('/api/quartos/nome/:nome', (req, res) => {
  console.log('[QUARTOS] GET /api/quartos/nome/:nome');
  try {
    const { nome } = req.params;
    const quarto = storage.getQuartoPorNome(decodeURIComponent(nome));
    if (!quarto) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    res.json(quarto);
  } catch (error: any) {
    console.error('[QUARTOS] Erro ao buscar quarto por nome:', error);
    res.status(500).json({ error: 'Erro ao buscar quarto', details: error.message });
  }
});

app.post('/api/quartos', (req, res) => {
  console.log('[QUARTOS] POST /api/quartos - Criando quarto');
  try {
    const { nome, precoBase, precoFimSemana, capacidade, descricao, comodidades, ativo } = req.body;
    
    if (!nome || !precoBase || !capacidade) {
      return res.status(400).json({ error: 'Nome, preço base e capacidade são obrigatórios' });
    }
    
    const novoQuarto = storage.saveQuarto({
      nome,
      precoBase: parseFloat(precoBase),
      precoFimSemana: precoFimSemana ? parseFloat(precoFimSemana) : undefined,
      capacidade: parseInt(capacidade),
      descricao,
      comodidades: comodidades || [],
      ativo: ativo !== false,
    });
    
    res.status(201).json(novoQuarto);
  } catch (error: any) {
    console.error('[QUARTOS] Erro ao criar quarto:', error);
    if (error.message === 'Quarto com este nome já existe') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao criar quarto', details: error.message });
  }
});

app.put('/api/quartos/:id', (req, res) => {
  console.log('[QUARTOS] PUT /api/quartos/:id - Atualizando quarto');
  try {
    const { id } = req.params;
    const updates: any = {};
    
    if (req.body.nome !== undefined) updates.nome = req.body.nome;
    if (req.body.precoBase !== undefined) updates.precoBase = parseFloat(req.body.precoBase);
    if (req.body.precoFimSemana !== undefined) updates.precoFimSemana = req.body.precoFimSemana ? parseFloat(req.body.precoFimSemana) : undefined;
    if (req.body.capacidade !== undefined) updates.capacidade = parseInt(req.body.capacidade);
    if (req.body.descricao !== undefined) updates.descricao = req.body.descricao;
    if (req.body.comodidades !== undefined) updates.comodidades = req.body.comodidades;
    if (req.body.ativo !== undefined) updates.ativo = req.body.ativo;
    
    const quartoAtualizado = storage.updateQuarto(parseInt(id), updates);
    if (!quartoAtualizado) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    
    res.json(quartoAtualizado);
  } catch (error: any) {
    console.error('[QUARTOS] Erro ao atualizar quarto:', error);
    if (error.message === 'Quarto com este nome já existe') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao atualizar quarto', details: error.message });
  }
});

app.get('/api/disponibilidade', (req, res) => {
  console.log('[DISPONIBILIDADE] GET /api/disponibilidade');
  console.log('Query params:', req.query);
  
  try {
    const { checkIn, checkOut, quarto } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({ 
        error: 'checkIn e checkOut são obrigatórios',
        disponivel: false 
      });
    }
    
    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ 
        error: 'Datas inválidas',
        disponivel: false 
      });
    }
    
    // Buscar reservas e bloqueios
    const reservas = storage.getReservas();
    const bloqueios = storage.getBloqueios();
    
    // Filtrar reservas do quarto específico (se fornecido)
    let reservasRelevantes = reservas.filter((r: any) => {
      if (r.status === 'cancelada') return false;
      if (quarto && r.quarto !== quarto) return false;
      return true;
    });
    
    // Verificar conflitos com reservas
    const reservasConflitantes = reservasRelevantes.filter((r: any) => {
      const rCheckIn = new Date(r.checkIn);
      const rCheckOut = new Date(r.checkOut);
      return (checkInDate < rCheckOut && checkOutDate > rCheckIn);
    });
    
    // Verificar bloqueios no período
    const bloqueiosConflitantes = bloqueios.filter((b: any) => {
      const dataBloqueio = new Date(b.data);
      return dataBloqueio >= checkInDate && dataBloqueio < checkOutDate;
    });
    
    const disponivel = reservasConflitantes.length === 0 && bloqueiosConflitantes.length === 0;
    
    console.log(`[DISPONIBILIDADE] Quarto: ${quarto || 'todos'}, Período: ${checkIn} a ${checkOut}`);
    console.log(`[DISPONIBILIDADE] Reservas conflitantes: ${reservasConflitantes.length}, Bloqueios: ${bloqueiosConflitantes.length}`);
    console.log(`[DISPONIBILIDADE] Disponível: ${disponivel}`);
    
    res.json({
      disponivel,
      reservasConflitantes: reservasConflitantes.map((r: any) => ({
        id: r.id,
        quarto: r.quarto || 'Quarto 1',
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        status: r.status,
      })),
      bloqueios: bloqueiosConflitantes.map((b: any) => ({
        id: b.id,
        data: b.data,
        motivo: b.motivo,
      })),
    });
  } catch (error: any) {
    console.error('[DISPONIBILIDADE] Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao verificar disponibilidade',
      details: error.message,
      disponivel: false 
    });
  }
});

// Endpoint de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API está respondendo (modo sem banco - apenas para testes)',
    timestamp: new Date().toISOString(),
    warning: '⚠️ Este servidor está rodando SEM banco de dados. Nada será salvo!'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API funcionando (modo sem banco)',
    database: 'not_connected',
    warning: '⚠️ Banco de dados não está disponível. Instale PostgreSQL para funcionalidade completa.'
  });
});

// Rota catch-all para 404
app.use('/api/*', (req, res) => {
  console.warn(`[404] Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
  });
});

// Middleware de tratamento de erros
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Erro não tratado:', err);
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: err.message || 'Erro desconhecido',
    });
  }
});

// Iniciar servidor SEM validar banco
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} (ARMAZENAMENTO JSON)`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Dados sendo salvos em: ${require('path').join(process.cwd(), 'data')}`);
  console.log(`⚠️  ATENÇÃO: Usando armazenamento em arquivo JSON (temporário)`);
  console.log(`⚠️  Instale PostgreSQL para funcionalidade completa com banco de dados.`);
  console.log(`✅ Reservas e bloqueios serão salvos e persistirão entre reinicializações!`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import reservaRoutes from './routes/reservaRoutes';
import calendarioRoutes from './routes/calendarioRoutes';
import bloqueioRoutes from './routes/bloqueioRoutes';
import precoRoutes from './routes/precoRoutes';
import hospedagemRoutes from './routes/hospedagemRoutes';
import relatorioRoutes from './routes/relatorioRoutes';
import disponibilidadeRoutes from './routes/disponibilidadeRoutes';
import quartoRoutes from './routes/quartoRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const prisma = new PrismaClient();

// Validar conexão com banco de dados na inicialização
async function validarConexaoBanco() {
  try {
    console.log('🔍 Validando conexão com banco de dados...');
    await prisma.$connect();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
    
    // Testar uma query simples
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Banco de dados está respondendo corretamente!');
  } catch (error: any) {
    console.error('❌ ERRO CRÍTICO: Não foi possível conectar ao banco de dados!');
    console.error('Detalhes do erro:', error.message);
    console.error('Código do erro:', error.code);
    console.error('\n⚠️  ATENÇÃO: O sistema requer conexão com PostgreSQL.');
    console.error('Verifique:');
    console.error('  1. Se o PostgreSQL está rodando');
    console.error('  2. Se a variável DATABASE_URL está configurada corretamente no arquivo .env');
    console.error('  3. Se as credenciais estão corretas');
    console.error('\nExemplo de DATABASE_URL:');
    console.error('  DATABASE_URL="postgresql://usuario:senha@localhost:5432/hospedagem?schema=public"');
    process.exit(1);
  }
}

// Configuração CORS mais permissiva para desenvolvimento e produção
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    console.log('[CORS] Origin recebida:', origin || 'N/A');
    
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) {
      console.log('[CORS] Sem origin, permitindo...');
      return callback(null, true);
    }
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    console.log('[CORS] Origens permitidas:', allowedOrigins);
    
    // Verificar se origin está na lista ou é localhost
    const isAllowed = 
      allowedOrigins.includes(origin) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      (process.env.FRONTEND_URL && origin.includes(new URL(process.env.FRONTEND_URL).hostname));
    
    if (isAllowed || !process.env.FRONTEND_URL) {
      console.log('[CORS] ✓ Origin permitida:', origin);
      callback(null, true);
    } else {
      console.warn('[CORS] ⚠ Origin não permitida:', origin);
      // Em desenvolvimento, permitir mesmo assim
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 horas
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware para tratar preflight requests explicitamente
app.options('*', (req, res) => {
  console.log('[CORS] Preflight request recebido:', req.headers.origin);
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

// Aumentar limite de tamanho do body para requisições grandes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de log para debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin || 'N/A');
  console.log('Headers:', {
    'content-type': req.headers['content-type'],
    'authorization': req.headers.authorization ? 'Presente' : 'Ausente',
  });
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    if (req.params && Object.keys(req.params).length > 0) {
      console.log('Params:', JSON.stringify(req.params, null, 2));
    }
    if (req.query && Object.keys(req.query).length > 0) {
      console.log('Query:', JSON.stringify(req.query, null, 2));
    }
  } catch (error) {
    console.error('Erro ao serializar dados do request:', error);
  }
  next();
});

// Rotas públicas
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/precos', precoRoutes);
app.use('/api/hospedagem', hospedagemRoutes);
app.use('/api/disponibilidade', disponibilidadeRoutes);

// Registrar rota de quartos se disponível
if (quartoRoutes) {
  app.use('/api/quartos', quartoRoutes);
}

// Rotas protegidas
app.use('/api/calendario', calendarioRoutes);
app.use('/api/bloqueios', bloqueioRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota principal da API
app.get('/api', (req, res) => {
  res.json({
    message: 'API Sistema de Hospedagem',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      reservas: '/api/reservas',
      hospedagem: '/api/hospedagem',
      precos: '/api/precos',
      disponibilidade: '/api/disponibilidade',
      calendario: '/api/calendario',
      bloqueios: '/api/bloqueios',
      relatorios: '/api/relatorios',
    },
  });
});

// Endpoint de teste simples (antes do health check)
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API está respondendo',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'N/A'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    // Testar conexão com banco
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      message: 'API funcionando',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({ 
      status: 'error', 
      message: 'API funcionando mas banco de dados não está disponível',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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

// Middleware de tratamento de erros global (deve ser o último)
app.use((err: any, req: any, res: any, next: any) => {
  console.error('[ERROR HANDLER] Erro não tratado:', err);
  console.error('[ERROR HANDLER] Stack:', err.stack);
  console.error('[ERROR HANDLER] Path:', req.path);
  console.error('[ERROR HANDLER] Method:', req.method);
  
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: err.message || 'Erro desconhecido',
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  }
});

// Inicializar servidor
async function iniciarServidor() {
  // Validar conexão antes de iniciar
  await validarConexaoBanco();
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
    console.log(`🌐 API disponível em http://0.0.0.0:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 CORS configurado para: ${process.env.FRONTEND_URL || 'localhost:3000'}`);
  });
  
  // Tratamento de erros do servidor
  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Erro: Porta ${PORT} já está em uso!`);
      console.error('   Feche o processo que está usando a porta ou mude a porta no .env');
    } else {
      console.error('❌ Erro no servidor:', error);
    }
    process.exit(1);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM recebido, encerrando servidor...');
    server.close(() => {
      console.log('Servidor encerrado');
      prisma.$disconnect();
      process.exit(0);
    });
  });
}

iniciarServidor().catch((error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});



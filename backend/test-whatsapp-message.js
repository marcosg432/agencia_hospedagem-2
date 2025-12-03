/**
 * Script de Teste para Validação de Mensagens WhatsApp
 * Execute com: node test-whatsapp-message.js
 * Requer Node.js 18+ (usa fetch nativo)
 */

const API_URL = process.env.API_URL || 'http://localhost:4000/api';
const TEST_TOKEN = process.env.TEST_TOKEN || ''; // Token JWT para testes

// Usar fetch nativo (Node.js 18+) ou axios se disponível
let fetchFunc;
try {
  fetchFunc = globalThis.fetch || fetch;
} catch (e) {
  try {
    const axios = require('axios');
    fetchFunc = async (url, options) => {
      const response = await axios({
        url,
        method: options?.method || 'GET',
        headers: options?.headers,
        data: options?.body ? JSON.parse(options.body) : undefined,
      });
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        json: async () => response.data,
        text: async () => JSON.stringify(response.data),
      };
    };
  } catch (err) {
    console.error('Erro: É necessário Node.js 18+ (com fetch) ou instalar axios');
    process.exit(1);
  }
}

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function criarReservaTeste(status) {
  const reservaTeste = {
    nome: `Teste WhatsApp - ${status}`,
    telefone: '(11) 99999-9999',
    qtdPessoas: 2,
    checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    valorTotal: 300.00,
    observacoes: `Reserva de teste para status ${status}`,
  };

  const response = await fetchFunc(`${API_URL}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservaTeste),
  });

  if (!response.ok) {
    throw new Error(`Erro ao criar reserva: ${response.status}`);
  }

  const data = await response.json();
  
  // Se precisar atualizar status
  if (status !== 'pendente' && data.id) {
    const headers = {
      'Content-Type': 'application/json',
      ...(TEST_TOKEN ? { Authorization: `Bearer ${TEST_TOKEN}` } : {}),
    };

    await fetchFunc(`${API_URL}/reservas/${data.id}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });
  }

  return data.id;
}

async function testarMensagemWhatsApp(reservaId, statusEsperado) {
  log(`\n=== TESTE: Reserva ${statusEsperado} ===`, 'cyan');
  
  try {
    const headers = {
      ...(TEST_TOKEN ? { Authorization: `Bearer ${TEST_TOKEN}` } : {}),
    };

    log(`Buscando mensagem para reserva ${reservaId}...`, 'yellow');
    const response = await fetchFunc(`${API_URL}/reservas/${reservaId}/whatsapp`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    log(`✓ Mensagem gerada com sucesso!`, 'green');
    log(`Status: ${data.status || 'N/A'}`, 'green');
    log(`Telefone: ${data.telefone || 'N/A'}`, 'green');
    log(`Nome: ${data.nome || 'N/A'}`, 'green');
    log(`\nMensagem:`, 'cyan');
    log(data.mensagem, 'cyan');
    
    // Validar mensagem
    if (!data.mensagem || data.mensagem.trim() === '') {
      log(`✗ ERRO: Mensagem vazia!`, 'red');
      return false;
    }

    // Verificar se contém informações básicas
    const contemNome = data.mensagem.includes(data.nome || '');
    const contemData = data.mensagem.match(/\d{2}\/\d{2}\/\d{4}/);
    
    log(`\nValidações:`, 'yellow');
    log(`  Contém nome: ${contemNome ? '✓' : '✗'}`, contemNome ? 'green' : 'red');
    log(`  Contém data: ${contemData ? '✓' : '✗'}`, contemData ? 'green' : 'red');
    
    // Verificar se mensagem está adequada ao status
    if (statusEsperado === 'confirmada' && !data.mensagem.toLowerCase().includes('confirmada')) {
      log(`  ⚠ Aviso: Status é 'confirmada' mas mensagem não menciona confirmação`, 'yellow');
    }
    
    if (statusEsperado === 'pendente' && !data.mensagem.toLowerCase().includes('solicitação') && !data.mensagem.toLowerCase().includes('pode confirmar')) {
      log(`  ⚠ Aviso: Status é 'pendente' mas mensagem não parece ser de solicitação`, 'yellow');
    }

    return true;
  } catch (error) {
    log(`✗ Erro ao gerar mensagem: ${error.message}`, 'red');
    return false;
  }
}

async function executarTestes() {
  log('\n=== TESTE DE MENSAGENS WHATSAPP ===\n', 'cyan');

  const statusParaTestar = ['pendente', 'confirmada', 'cancelada'];
  const reservasIds = [];

  // Criar reservas de teste
  log('Criando reservas de teste...', 'yellow');
  for (const status of statusParaTestar) {
    try {
      const id = await criarReservaTeste(status);
      reservasIds.push({ id, status });
      log(`✓ Reserva ${status} criada com ID: ${id}`, 'green');
    } catch (error) {
      log(`✗ Erro ao criar reserva ${status}: ${error.message}`, 'red');
    }
  }

  // Testar mensagens
  let sucessos = 0;
  let falhas = 0;

  for (const { id, status } of reservasIds) {
    const sucesso = await testarMensagemWhatsApp(id, status);
    if (sucesso) {
      sucessos++;
    } else {
      falhas++;
    }
    
    // Aguardar um pouco antes do próximo teste
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Resumo
  log(`\n=== RESUMO DOS TESTES ===`, 'cyan');
  log(`Sucessos: ${sucessos}/${reservasIds.length}`, sucessos === reservasIds.length ? 'green' : 'yellow');
  log(`Falhas: ${falhas}/${reservasIds.length}`, falhas === 0 ? 'green' : 'red');
  
  if (sucessos === reservasIds.length) {
    log(`\n✓✓✓ TODOS OS TESTES PASSARAM! ✓✓✓`, 'green');
  } else {
    log(`\n✗ Alguns testes falharam. Verifique os logs acima.`, 'red');
  }
}

// Executar testes
executarTestes().catch(error => {
  log(`\n✗ Erro fatal no teste: ${error.message}`, 'red');
  process.exit(1);
});




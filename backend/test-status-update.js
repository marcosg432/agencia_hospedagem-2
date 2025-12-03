/**
 * Script de Teste para Validação de Atualização de Status
 * Execute com: node test-status-update.js
 * Requer Node.js 18+ (usa fetch nativo)
 */

// Usar fetch nativo (Node.js 18+) ou axios se disponível
let fetchFunc;
try {
  // Tentar usar fetch nativo
  fetchFunc = globalThis.fetch || fetch;
} catch (e) {
  // Se não disponível, tentar axios
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

const API_URL = process.env.API_URL || 'http://localhost:4000/api';
const TEST_TOKEN = process.env.TEST_TOKEN || ''; // Token JWT para testes

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

async function testarAtualizacaoStatus() {
  log('\n=== TESTE DE ATUALIZAÇÃO DE STATUS ===\n', 'cyan');

  // Primeiro, criar uma reserva de teste
  log('1. Criando reserva de teste...', 'yellow');
  let reservaId;

  try {
    const reservaTeste = {
      nome: 'Teste Status Update',
      telefone: '(11) 99999-9999',
      qtdPessoas: 2,
      checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Amanhã
      checkOut: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Depois de amanhã
      valorTotal: 300.00,
      observacoes: 'Reserva criada para teste de atualização de status',
    };

    const criarResposta = await fetchFunc(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservaTeste),
    });
    const criarData = await criarResposta.json();
    reservaId = criarData.id;
    log(`✓ Reserva criada com ID: ${reservaId}`, 'green');
    log(`  Status inicial: ${criarData.status}`, 'green');
  } catch (error) {
    log(`✗ Erro ao criar reserva: ${error.message}`, 'red');
    if (error.response) {
      log(`  Status: ${error.response.status}`, 'red');
      log(`  Data: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
    return;
  }

  // Testar atualização para cada status
  const statusParaTestar = ['confirmada', 'cancelada', 'pendente', 'confirmada'];

  for (let i = 0; i < statusParaTestar.length; i++) {
    const novoStatus = statusParaTestar[i];
    log(`\n${i + 2}. Testando atualização para status: ${novoStatus}`, 'yellow');

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(TEST_TOKEN ? { Authorization: `Bearer ${TEST_TOKEN}` } : {}),
      };
      
      log(`  Enviando PUT ${API_URL}/reservas/${reservaId}/status`, 'cyan');
      log(`  Body: { "status": "${novoStatus}" }`, 'cyan');

      const response = await fetchFunc(
        `${API_URL}/reservas/${reservaId}/status`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const responseData = await response.json();

      log(`  ✓ Status atualizado com sucesso!`, 'green');
      log(`  Status retornado: ${responseData.status}`, 'green');
      log(`  ID da reserva: ${responseData.id}`, 'green');
      log(`  Nome: ${responseData.nome}`, 'green');

      // Verificar se o status foi realmente atualizado
      if (responseData.status === novoStatus) {
        log(`  ✓ Status correto no retorno`, 'green');
      } else {
        log(`  ✗ ERRO: Status esperado "${novoStatus}" mas recebido "${responseData.status}"`, 'red');
      }

      // Aguardar um pouco antes do próximo teste
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      log(`  ✗ Erro ao atualizar status: ${error.message}`, 'red');
      if (error.response) {
        log(`  Status HTTP: ${error.response.status}`, 'red');
        log(`  Erro: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    }
  }

  // Verificar status final
  log(`\n${statusParaTestar.length + 2}. Verificando status final...`, 'yellow');
  try {
    const headers = {
      ...(TEST_TOKEN ? { Authorization: `Bearer ${TEST_TOKEN}` } : {}),
    };
    const response = await fetchFunc(`${API_URL}/reservas/${reservaId}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const responseData = await response.json();
    log(`  Status final: ${responseData.status}`, 'green');
    log(`  Reserva completa:`, 'cyan');
    log(JSON.stringify(responseData, null, 2), 'cyan');
  } catch (error) {
    log(`  ✗ Erro ao verificar status final: ${error.message}`, 'red');
  }

  log('\n=== TESTE CONCLUÍDO ===\n', 'cyan');
}

// Executar teste
testarAtualizacaoStatus().catch(error => {
  log(`\n✗ Erro fatal no teste: ${error.message}`, 'red');
  process.exit(1);
});


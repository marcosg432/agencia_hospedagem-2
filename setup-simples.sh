#!/bin/bash

# Script SIMPLES para configurar tudo na Hostinger
# Uso: bash setup-simples.sh

set -e

echo "🚀 Configuração Simples - Sistema de Hospedagem"
echo "================================================"

# Criar pasta e entrar
echo ""
echo "📁 Criando pasta do projeto..."
mkdir -p ~/casa10
cd ~/casa10

# Clonar repositório
echo ""
echo "📥 Clonando repositório..."
git clone https://github.com/marcosg432/agencia_hospedagem-2.git .
cd agencia_hospedagem-2

# Backend
echo ""
echo "⚙️  Configurando backend..."
cd backend
npm install
npm run build

# Criar .env do backend se não existir
if [ ! -f .env ]; then
    echo "📝 Criando .env do backend..."
    cat > .env << EOF
PORT=4000
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=http://localhost:3001
EOF
    echo "✅ Arquivo .env criado"
fi

cd ..

# Frontend
echo ""
echo "⚙️  Configurando frontend..."
cd frontend
npm install
npm run build

# Criar .env.local do frontend se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando .env.local do frontend..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000/api
PORT=3001
EOF
    echo "✅ Arquivo .env.local criado"
fi

cd ..

# Criar script de inicialização simples
echo ""
echo "📝 Criando script de inicialização..."
cat > iniciar.sh << 'EOFSCRIPT'
#!/bin/bash
cd ~/casa10/agencia_hospedagem-2

# Backend em background
echo "🚀 Iniciando backend na porta 4000..."
cd backend
PORT=4000 node dist/server-sem-banco.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID" > ../logs/pids.txt
cd ..

# Aguardar backend iniciar
sleep 3

# Frontend em background
echo "🚀 Iniciando frontend na porta 3001..."
cd frontend
PORT=3001 npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID" >> ../logs/pids.txt
cd ..

echo ""
echo "✅ Sistema iniciado!"
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:3001"
echo ""
echo "Para parar: bash parar.sh"
echo "Para ver logs: tail -f logs/backend.log ou tail -f logs/frontend.log"
EOFSCRIPT

# Criar script para parar
cat > parar.sh << 'EOFSCRIPT'
#!/bin/bash
cd ~/casa10/agencia_hospedagem-2

if [ -f logs/pids.txt ]; then
    echo "🛑 Parando processos..."
    while read pid; do
        kill $pid 2>/dev/null || true
    done < logs/pids.txt
    rm logs/pids.txt
    echo "✅ Processos parados"
else
    echo "❌ Nenhum processo encontrado"
fi
EOFSCRIPT

# Criar diretório de logs
mkdir -p logs

# Dar permissão de execução
chmod +x iniciar.sh
chmod +x parar.sh

echo ""
echo "✅✅✅ CONFIGURAÇÃO CONCLUÍDA! ✅✅✅"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Configure as variáveis de ambiente (se necessário):"
echo "   nano backend/.env"
echo "   nano frontend/.env.local"
echo ""
echo "2. Inicie o sistema:"
echo "   cd ~/casa10/agencia_hospedagem-2"
echo "   bash iniciar.sh"
echo ""
echo "3. Para parar o sistema:"
echo "   bash parar.sh"
echo ""
echo "4. Para ver os logs:"
echo "   tail -f logs/backend.log"
echo "   tail -f logs/frontend.log"
echo ""
echo "🌐 URLs:"
echo "   Backend API: http://localhost:4000/api"
echo "   Frontend: http://localhost:3001"
echo "   Admin: http://localhost:3001/admin/login"
echo ""


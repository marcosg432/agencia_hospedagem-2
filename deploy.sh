#!/bin/bash

# Script de deploy automático para Hostinger
# Uso: bash deploy.sh

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy na Hostinger..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na raiz do projeto
if [ ! -f "ecosystem.config.js" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# 1. Instalar dependências do backend
echo -e "${YELLOW}[1/5] Instalando dependências do backend...${NC}"
cd backend
npm install --production
echo -e "${GREEN}✓ Backend dependências instaladas${NC}"

# 2. Compilar backend
echo -e "${YELLOW}[2/5] Compilando backend TypeScript...${NC}"
npm run build
echo -e "${GREEN}✓ Backend compilado${NC}"
cd ..

# 3. Instalar dependências do frontend
echo -e "${YELLOW}[3/5] Instalando dependências do frontend...${NC}"
cd frontend
npm install
echo -e "${GREEN}✓ Frontend dependências instaladas${NC}"

# 4. Build do frontend
echo -e "${YELLOW}[4/5] Fazendo build do frontend...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend buildado${NC}"
cd ..

# 5. Criar diretório de logs se não existir
echo -e "${YELLOW}[5/5] Preparando diretório de logs...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Diretório de logs criado${NC}"

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠ PM2 não encontrado. Instalando...${NC}"
    npm install -g pm2
fi

# Reiniciar aplicações com PM2
echo -e "${YELLOW}🔄 Reiniciando aplicações com PM2...${NC}"
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "📊 Status das aplicações:"
pm2 status
echo ""
echo "📝 Para ver os logs:"
echo "   pm2 logs"
echo ""
echo "📝 Para monitorar:"
echo "   pm2 monit"


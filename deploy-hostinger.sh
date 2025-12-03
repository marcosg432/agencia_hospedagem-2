#!/bin/bash

# Script de Deploy para Hostinger
# Execute: chmod +x deploy-hostinger.sh && ./deploy-hostinger.sh

echo "🚀 Iniciando deploy para Hostinger..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na raiz do projeto
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Construindo frontend...${NC}"
cd frontend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao construir frontend!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend construído com sucesso!${NC}"
cd ..

echo -e "${YELLOW}📦 Construindo backend...${NC}"
cd backend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao construir backend!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend construído com sucesso!${NC}"
cd ..

echo -e "${GREEN}✅ Build completo!${NC}"
echo -e "${YELLOW}📤 Agora você pode fazer upload dos arquivos para a Hostinger${NC}"
echo ""
echo "Pastas para upload:"
echo "  - frontend/.next (ou frontend/out se export estático)"
echo "  - backend/dist"
echo "  - backend/node_modules (ou instale no servidor)"
echo "  - backend/package.json"
echo "  - .htaccess (para frontend estático)"


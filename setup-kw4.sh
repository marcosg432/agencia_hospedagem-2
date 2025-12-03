#!/bin/bash

# Script de configuração automática para Hostinger KW4
# Execute: chmod +x setup-kw4.sh && ./setup-kw4.sh

echo "🚀 Configurando sistema no Hostinger KW4..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se está no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Verificar Node.js
echo -e "${YELLOW}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Instalando Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}✓ Node.js já instalado${NC}"
fi

# Verificar PM2
echo -e "${YELLOW}Verificando PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Instalando PM2...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 já instalado${NC}"
fi

# Configurar Backend
echo -e "${YELLOW}📦 Configurando Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Criando arquivo .env...${NC}"
    cat > .env << EOF
PORT=4000
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
FRONTEND_URL=https://seudominio.com
EOF
    echo -e "${GREEN}✓ Arquivo .env criado${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env e configure DATABASE_URL!${NC}"
fi

npm install --production
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend buildado com sucesso${NC}"
    pm2 delete hospedagem-backend 2>/dev/null
    pm2 start dist/server.js --name "hospedagem-backend"
    pm2 save
    echo -e "${GREEN}✓ Backend iniciado com PM2${NC}"
else
    echo -e "${RED}❌ Erro ao buildar backend${NC}"
    exit 1
fi

cd ..

# Configurar Frontend
echo -e "${YELLOW}📦 Configurando Frontend...${NC}"
cd frontend

if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}Criando arquivo .env.production...${NC}"
    cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
EOF
    echo -e "${GREEN}✓ Arquivo .env.production criado${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env.production com a URL correta do backend!${NC}"
fi

npm install --production
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend buildado com sucesso${NC}"
    pm2 delete hospedagem-frontend 2>/dev/null
    pm2 start npm --name "hospedagem-frontend" -- start
    pm2 save
    echo -e "${GREEN}✓ Frontend iniciado com PM2${NC}"
else
    echo -e "${RED}❌ Erro ao buildar frontend${NC}"
    exit 1
fi

cd ..

# Verificar status
echo -e "${GREEN}✅ Configuração completa!${NC}"
echo ""
echo "Status dos serviços:"
pm2 status
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Configure Nginx (ver DEPLOY-HOSTINGER-KW4.md)"
echo "2. Configure SSL com Certbot"
echo "3. Configure firewall"
echo "4. Aponte seus domínios para o IP do VPS"


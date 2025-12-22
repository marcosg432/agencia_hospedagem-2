# Guia de Deploy na Hostinger

Este guia explica como fazer o deploy do sistema de hospedagem na Hostinger.

## 📋 Pré-requisitos

1. Conta na Hostinger com acesso a Node.js (VPS ou Cloud Hosting)
2. Node.js 18+ instalado no servidor
3. Git instalado
4. PM2 instalado globalmente (`npm install -g pm2`)

## 🚀 Passo a Passo

### 1. Preparar o Servidor

Conecte-se ao servidor via SSH e execute:

```bash
# Atualizar sistema (se necessário)
sudo apt update && sudo apt upgrade -y

# Instalar Node.js (se não estiver instalado)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar instalações
node --version
npm --version
pm2 --version
```

### 2. Clonar o Repositório

```bash
# Navegar para o diretório onde deseja instalar
cd ~

# Clonar o repositório (substitua pela URL do seu repositório)
git clone https://github.com/seu-usuario/seu-repositorio.git pousada
cd pousada
```

### 3. Instalar Dependências

```bash
# Instalar dependências do backend
cd backend
npm install --production

# Compilar TypeScript do backend
npm run build

# Voltar para raiz
cd ../frontend

# Instalar dependências do frontend
npm install

# Fazer build do frontend
npm run build
```

### 4. Configurar Variáveis de Ambiente

#### Backend (.env)

Crie o arquivo `backend/.env`:

```env
# Porta do backend (Hostinger pode fornecer via variável de ambiente)
PORT=4000
BACKEND_PORT=4000

# JWT Secret (use um valor seguro e único)
JWT_SECRET=seu-jwt-secret-super-seguro-gerar-com-openssl

# URL do frontend (ajuste com seu domínio)
FRONTEND_URL=https://seudominio.com
```

#### Frontend (.env.local)

Crie o arquivo `frontend/.env.local`:

```env
# URL da API backend (ajuste com seu domínio e porta)
NEXT_PUBLIC_API_URL=https://seudominio.com:4000/api

# Porta do frontend (evitar 3000 se estiver em uso)
FRONTEND_PORT=3001
PORT=3001
```

**⚠️ IMPORTANTE**: Substitua `seudominio.com` pelo seu domínio real na Hostinger.

### 5. Gerar JWT Secret Seguro

```bash
# Gerar um JWT secret seguro
openssl rand -base64 32
```

Use o resultado no arquivo `backend/.env` como `JWT_SECRET`.

### 6. Criar Diretório de Logs

```bash
# Na raiz do projeto
mkdir -p logs
```

### 7. Iniciar Aplicação com PM2

```bash
# Voltar para a raiz do projeto
cd ~/pousada

# Iniciar aplicações
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot do sistema
pm2 startup
# Siga as instruções que aparecerem
```

### 8. Verificar Status

```bash
# Ver status das aplicações
pm2 status

# Ver logs
pm2 logs

# Ver logs apenas do backend
pm2 logs backend-pousada

# Ver logs apenas do frontend
pm2 logs frontend-pousada
```

### 9. Configurar Proxy Reverso (Nginx)

Se você usar Nginx como proxy reverso, crie o arquivo `/etc/nginx/sites-available/pousada`:

```nginx
server {
    listen 80;
    server_name seudominio.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative o site:

```bash
sudo ln -s /etc/nginx/sites-available/pousada /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 10. Configurar Firewall (se necessário)

```bash
# Permitir portas (ajuste conforme necessário)
sudo ufw allow 3001/tcp
sudo ufw allow 4000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 🔧 Comandos Úteis do PM2

```bash
# Parar todas as aplicações
pm2 stop all

# Reiniciar todas as aplicações
pm2 restart all

# Recarregar aplicações (zero downtime)
pm2 reload all

# Remover aplicações
pm2 delete all

# Monitorar em tempo real
pm2 monit
```

## 📝 Atualizar Aplicação

Após fazer alterações:

```bash
cd ~/pousada

# Atualizar código
git pull

# Reinstalar dependências (se necessário)
cd backend && npm install --production && npm run build && cd ..
cd frontend && npm install && npm run build && cd ..

# Reiniciar aplicações
pm2 restart all
```

## ⚠️ Solução de Problemas

### Porta já em uso

Se a porta 3001 ou 4000 estiver em uso:

1. Edite `ecosystem.config.js` e altere as portas
2. Atualize os arquivos `.env` e `.env.local`
3. Reinicie com `pm2 restart all`

### Erro de conexão

1. Verifique se as aplicações estão rodando: `pm2 status`
2. Verifique os logs: `pm2 logs`
3. Verifique se as portas estão abertas: `netstat -tulpn | grep LISTEN`
4. Verifique variáveis de ambiente: `pm2 env 0` (backend) e `pm2 env 1` (frontend)

### CORS Error

1. Verifique se `FRONTEND_URL` no `.env` do backend está correto
2. Verifique se `NEXT_PUBLIC_API_URL` no `.env.local` do frontend está correto
3. Certifique-se de que ambos usam o mesmo domínio (com/sem https)

## 📞 Suporte

Se tiver problemas, verifique:
- Logs do PM2: `pm2 logs`
- Logs do sistema: `journalctl -xe`
- Status do Nginx: `sudo systemctl status nginx`


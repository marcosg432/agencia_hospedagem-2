# 🚀 Deploy na Hostinger - Guia Rápido

## ⚠️ Importante - Portas

O sistema está configurado para usar:
- **Backend**: Porta `4000` (ou variável `BACKEND_PORT`)
- **Frontend**: Porta `3001` (para evitar conflito com porta 3000)

## 📦 Pré-requisitos

1. Node.js 18+ instalado
2. PM2 instalado: `npm install -g pm2`
3. Git instalado

## 🔧 Configuração Rápida

### 1. Variáveis de Ambiente

**Backend** (`backend/.env`):
```env
PORT=4000
BACKEND_PORT=4000
JWT_SECRET=seu-jwt-secret-aqui
FRONTEND_URL=https://seudominio.com
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://seudominio.com:4000/api
PORT=3001
FRONTEND_PORT=3001
```

### 2. Deploy

```bash
# 1. Clone o repositório
git clone seu-repositorio
cd pousada-2

# 2. Execute o script de deploy
bash deploy.sh

# OU faça manualmente:
cd backend && npm install --production && npm run build && cd ..
cd frontend && npm install && npm run build && cd ..
pm2 start ecosystem.config.js
pm2 save
```

### 3. Verificar

```bash
pm2 status
pm2 logs
```

## 📝 Comandos Úteis

```bash
# Parar
pm2 stop all

# Reiniciar
pm2 restart all

# Ver logs
pm2 logs

# Monitorar
pm2 monit
```

## 🔄 Atualizar

```bash
git pull
bash deploy.sh
```

## ⚙️ Alterar Portas

Se precisar mudar as portas:

1. Edite `ecosystem.config.js`:
   - Altere `PORT: process.env.BACKEND_PORT || 4000`
   - Altere `PORT: process.env.FRONTEND_PORT || 3001`

2. Atualize os arquivos `.env`:
   - `backend/.env`: `BACKEND_PORT=nova_porta`
   - `frontend/.env.local`: `FRONTEND_PORT=nova_porta`

3. Reinicie:
   ```bash
   pm2 restart all
   ```

## 🆘 Problemas Comuns

### Porta já em uso
```bash
# Verificar portas em uso
netstat -tulpn | grep LISTEN

# Matar processo na porta
sudo lsof -ti:3001 | xargs kill -9
```

### Erro de conexão
1. Verifique `pm2 status` - ambas aplicações devem estar "online"
2. Verifique os logs: `pm2 logs`
3. Verifique variáveis de ambiente: `pm2 env 0`

### CORS Error
Certifique-se que:
- `FRONTEND_URL` no backend `.env` está correto
- `NEXT_PUBLIC_API_URL` no frontend `.env.local` está correto
- Ambos usam o mesmo domínio

## 📞 Suporte

Consulte o arquivo `deploy-hostinger.md` para instruções detalhadas.


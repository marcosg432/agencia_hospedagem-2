# 🚀 Guia SIMPLES para Hostinger - Passo a Passo

## Método Simplificado (Sem PM2)

### Passo 1: Acessar o Terminal da Hostinger

1. No painel da Hostinger, clique no botão **"Terminal"** (canto superior direito)
2. Ou conecte via SSH:
   ```bash
   ssh root@193.160.119.67
   ```

### Passo 2: Executar o Script Automático

```bash
# Baixar e executar o script
curl -sSL https://raw.githubusercontent.com/marcosg432/agencia_hospedagem-2/main/setup-simples.sh | bash

# OU se você já tem o projeto clonado:
cd ~/casa10/agencia_hospedagem-2
bash setup-simples.sh
```

### Passo 3: Configurar (Opcional)

Se precisar ajustar as configurações:

```bash
# Editar configurações do backend
nano backend/.env

# Editar configurações do frontend  
nano frontend/.env.local
```

### Passo 4: Iniciar o Sistema

```bash
cd ~/casa10/agencia_hospedagem-2
bash iniciar.sh
```

Pronto! 🎉

---

## Método Manual (Passo a Passo)

Se preferir fazer manualmente:

### 1. Criar pasta e clonar

```bash
mkdir -p ~/casa10
cd ~/casa10
git clone https://github.com/marcosg432/agencia_hospedagem-2.git
cd agencia_hospedagem-2
```

### 2. Instalar dependências do backend

```bash
cd backend
npm install
npm run build
cd ..
```

### 3. Criar .env do backend

```bash
cd backend
nano .env
```

Cole isso:
```env
PORT=4000
JWT_SECRET=seu-secret-aqui
FRONTEND_URL=http://localhost:3001
```

Salve: `Ctrl+X`, depois `Y`, depois `Enter`

### 4. Instalar dependências do frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

### 5. Criar .env.local do frontend

```bash
cd frontend
nano .env.local
```

Cole isso:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
PORT=3001
```

Salve: `Ctrl+X`, depois `Y`, depois `Enter`

### 6. Iniciar tudo

**Terminal 1 - Backend:**
```bash
cd ~/casa10/agencia_hospedagem-2/backend
PORT=4000 node dist/server-sem-banco.js
```

**Terminal 2 - Frontend:**
```bash
cd ~/casa10/agencia_hospedagem-2/frontend
PORT=3001 npm start
```

---

## Abrir Portas no Firewall (Se necessário)

Se as portas estiverem bloqueadas:

```bash
# Verificar se firewall está ativo
sudo ufw status

# Se estiver ativo, permitir portas
sudo ufw allow 3001/tcp
sudo ufw allow 4000/tcp

# Se não tiver firewall configurado, pode pular este passo
```

---

## Rodar em Background (Opcional)

Se quiser rodar em background sem PM2:

```bash
# Backend
cd ~/casa10/agencia_hospedagem-2/backend
nohup PORT=4000 node dist/server-sem-banco.js > ../logs/backend.log 2>&1 &

# Frontend
cd ~/casa10/agencia_hospedagem-2/frontend
nohup PORT=3001 npm start > ../logs/frontend.log 2>&1 &
```
```

Para parar:
```bash
# Ver processos
ps aux | grep node

# Matar processos
pkill -f "server-sem-banco"
pkill -f "next start"
```

---

## Verificar se está funcionando

```bash
# Ver se as portas estão abertas
netstat -tulpn | grep -E '3001|4000'

# Ou testar com curl
curl http://localhost:4000/api/health
curl http://localhost:3001
```

---

## Acessar

- **Frontend:** http://seu-ip:3001
- **Admin:** http://seu-ip:3001/admin/login
- **Backend API:** http://seu-ip:4000/api

**Credenciais admin:**
- Email: `admin@admin.com`
- Senha: `admin123`

---

## Atualizar o Projeto

```bash
cd ~/casa10/agencia_hospedagem-2
git pull
cd backend && npm install && npm run build && cd ..
cd frontend && npm install && npm run build && cd ..
# Reiniciar os processos
```

---

## ⚠️ Dicas Importantes

1. **Portas:** O sistema usa porta 3001 (frontend) e 4000 (backend) para evitar conflitos
2. **Se precisar mudar:** Edite os arquivos `.env` e `.env.local`
3. **Para manter rodando:** Use `screen` ou `tmux` para manter sessões abertas
4. **Logs:** Estão em `~/casa10/agencia_hospedagem-2/logs/`

## 🔧 Usando Screen (Recomendado)

Para manter rodando mesmo fechando o terminal:

```bash
# Instalar screen (se não tiver)
sudo apt install screen -y

# Criar sessão para backend
screen -S backend
cd ~/casa10/agencia_hospedagem-2/backend
PORT=4000 node dist/server-sem-banco.js
# Ctrl+A depois D para sair da sessão

# Criar sessão para frontend
screen -S frontend
cd ~/casa10/agencia_hospedagem-2/frontend
PORT=3001 npm start
# Ctrl+A depois D para sair da sessão

# Para voltar às sessões:
screen -r backend
screen -r frontend

# Para listar sessões:
screen -ls
```


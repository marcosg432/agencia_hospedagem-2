# Sistema de Gerenciamento de Hospedagem

Sistema completo de gerenciamento de hospedagem (pousada/chalé) com frontend e backend integrados.

## 🚀 Tecnologias

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma
- JWT para autenticação

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- Axios

## 📁 Estrutura

```
/
├── backend/          # API Node.js + Express
├── frontend/         # Next.js App
└── README.md
```

## ⚙️ Configuração

### Backend

1. Entre na pasta `backend`
2. Instale as dependências: `npm install`
3. Crie o arquivo `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hospedagem?schema=public"
JWT_SECRET="seu-jwt-secret-super-seguro"
PORT=4000
```
4. Execute as migrações: `npm run prisma:migrate`
5. Execute o seed: `npm run prisma:seed`
6. Inicie o servidor: `npm run dev`

### Frontend

1. Entre na pasta `frontend`
2. Instale as dependências: `npm install`
3. Crie o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
4. Inicie o servidor: `npm run dev`

## 🔐 Credenciais Padrão

- **Email:** admin@admin.com
- **Senha:** admin123

## 📱 Funcionalidades

### Páginas Públicas
- Home com banner e apresentação
- Sobre com história e localização
- Galeria de fotos
- Contato com formulário e mapa
- Reserva pública

### Painel Administrativo
- Calendário mensal com visualização de ocupação
- Gerenciamento de reservas
- Tabela de preços
- Cadastro da hospedagem
- Relatórios mensais
- Geração de mensagens WhatsApp

## 🚢 Deploy

### Backend (Railway)
1. Conecte o repositório
2. Configure as variáveis de ambiente
3. O deploy é automático

### Frontend (Vercel)
1. Conecte o repositório
2. Configure `NEXT_PUBLIC_API_URL`
3. O deploy é automático

## 📝 Licença

Este projeto foi criado para fins educacionais.





#!/bin/bash

# Script para iniciar produção manualmente (sem PM2)
# Útil para testes ou se PM2 não estiver disponível

echo "🚀 Iniciando aplicações..."

# Backend
cd backend
echo "Iniciando backend na porta 4000..."
PORT=4000 JWT_SECRET=${JWT_SECRET:-seu-jwt-secret-super-seguro} node dist/server-sem-banco.js &
BACKEND_PID=$!
cd ..

# Frontend
cd frontend
echo "Iniciando frontend na porta 3001..."
PORT=3001 NEXT_PUBLIC_API_URL=http://localhost:4000/api npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Aplicações iniciadas!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Para parar, execute:"
echo "kill $BACKEND_PID $FRONTEND_PID"


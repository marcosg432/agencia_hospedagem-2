import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      senha: hashedPassword,
      nome: 'Administrador',
      role: 'admin',
    },
  });

  // Criar preços padrão
  await prisma.preco.upsert({
    where: { tipo: 'comum' },
    update: {},
    create: {
      tipo: 'comum',
      valor: 150.0,
      descricao: 'Preço padrão para dias úteis',
    },
  });

  await prisma.preco.upsert({
    where: { tipo: 'fim_semana' },
    update: {},
    create: {
      tipo: 'fim_semana',
      valor: 200.0,
      descricao: 'Preço para sexta, sábado e domingo',
    },
  });

  // Criar hospedagem padrão
  await prisma.hospedagem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'Pousada Encanto',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-9999',
      whatsapp: '5511999999999',
      capacidadeMax: 20,
      fotos: [],
      descricao: 'Uma pousada aconchegante no coração da cidade',
    },
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });





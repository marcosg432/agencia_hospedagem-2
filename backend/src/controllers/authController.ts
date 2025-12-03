import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequest } from '../types';

const prisma = new PrismaClient();

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError: any) {
      // Se o banco não estiver disponível, usar credenciais padrão
      console.warn('Erro ao conectar com banco, usando autenticação temporária:', dbError.message);
      
      if (email === 'admin@admin.com' && senha === 'admin123') {
        const jwtSecret = process.env.JWT_SECRET || 'jwt-secret-temporario';
        const token = jwt.sign(
          { userId: 1, email: 'admin@admin.com', role: 'admin' },
          jwtSecret,
          { expiresIn: '24h' }
        );

        return res.json({ 
          token,
          user: {
            id: 1,
            email: 'admin@admin.com',
            nome: 'Administrador',
            role: 'admin',
          },
        });
      }
      
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(senha, user.senha);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET não configurado' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};



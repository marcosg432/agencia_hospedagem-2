import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Lista padrão de quartos (pode ser configurada via Hospedagem no futuro)
const QUARTOS_PADRAO = [
  { id: 1, nome: 'Quarto 1', capacidade: 2, precoBase: 100, ativo: true },
  { id: 2, nome: 'Quarto 2', capacidade: 2, precoBase: 100, ativo: true },
  { id: 3, nome: 'Quarto 3', capacidade: 4, precoBase: 150, ativo: true },
];

// GET /api/quartos - Listar todos os quartos
router.get('/', (req: Request, res: Response) => {
  try {
    console.log('[QUARTOS] GET /api/quartos - Listando quartos');
    res.json(QUARTOS_PADRAO.filter(q => q.ativo !== false));
  } catch (error: any) {
    console.error('[QUARTOS] Erro ao listar:', error);
    res.status(500).json({ error: 'Erro ao listar quartos', details: error.message });
  }
});

// GET /api/quartos/:id - Buscar quarto por ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quarto = QUARTOS_PADRAO.find(q => q.id === parseInt(id));
    if (!quarto) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    res.json(quarto);
  } catch (error: any) {
    console.error('[QUARTOS] Erro ao buscar quarto:', error);
    res.status(500).json({ error: 'Erro ao buscar quarto', details: error.message });
  }
});

export default router;

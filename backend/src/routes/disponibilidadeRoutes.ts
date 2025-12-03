import { Router } from 'express';
import { verificarDisponibilidade } from '../controllers/disponibilidadeController';

const router = Router();

// Rota pública para verificar disponibilidade
router.get('/', verificarDisponibilidade);

export default router;


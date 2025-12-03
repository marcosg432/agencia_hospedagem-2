import { Router } from 'express';
import {
  listarPrecos,
  atualizarPreco,
  criarPreco,
} from '../controllers/precoController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', listarPrecos);
router.post('/', authenticateToken, criarPreco);
router.put('/:id', authenticateToken, atualizarPreco);

export default router;





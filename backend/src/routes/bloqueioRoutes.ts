import { Router } from 'express';
import {
  criarBloqueio,
  listarBloqueios,
  deletarBloqueio,
} from '../controllers/bloqueioController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, criarBloqueio);
router.get('/', authenticateToken, listarBloqueios);
router.delete('/:id', authenticateToken, deletarBloqueio);

export default router;





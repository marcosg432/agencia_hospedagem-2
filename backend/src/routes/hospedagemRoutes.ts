import { Router } from 'express';
import {
  obterHospedagem,
  atualizarHospedagem,
} from '../controllers/hospedagemController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', obterHospedagem);
router.put('/', authenticateToken, atualizarHospedagem);

export default router;





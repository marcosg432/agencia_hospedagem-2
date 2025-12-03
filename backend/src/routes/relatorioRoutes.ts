import { Router } from 'express';
import { obterRelatorio } from '../controllers/relatorioController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, obterRelatorio);

export default router;





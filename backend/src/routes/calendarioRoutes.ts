import { Router } from 'express';
import { obterCalendario } from '../controllers/calendarioController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, obterCalendario);

export default router;





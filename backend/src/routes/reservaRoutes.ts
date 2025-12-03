import { Router } from 'express';
import {
  criarReserva,
  listarReservas,
  obterReserva,
  atualizarStatus,
  deletarReserva,
  gerarMensagemWhatsApp,
} from '../controllers/reservaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rota pública para criar reserva
router.post('/', criarReserva);

// Rotas protegidas
router.get('/', authenticateToken, listarReservas);
router.get('/:id', authenticateToken, obterReserva);
router.put('/:id/status', authenticateToken, atualizarStatus);
router.delete('/:id', authenticateToken, deletarReserva);
router.get('/:id/whatsapp', authenticateToken, gerarMensagemWhatsApp);

export default router;





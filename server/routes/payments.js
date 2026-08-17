import { Router } from 'express';
import { confirmPayment, getPayment, initiatePayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.post('/', initiatePayment);
router.get('/:orderId', getPayment);
router.post('/:id/confirm', confirmPayment);

export default router;

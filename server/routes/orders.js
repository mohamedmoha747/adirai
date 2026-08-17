import { Router } from 'express';
import { createOrder, getOrder, myOrders, trackOrder, updateStatus } from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createOrderValidator, statusValidator } from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.get('/track/:orderNumber', optionalAuth, trackOrder);
router.use(protect);
router.post('/', createOrderValidator, validateRequest, createOrder);
router.get('/', myOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', statusValidator, validateRequest, updateStatus);

export default router;

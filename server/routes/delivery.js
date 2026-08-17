import { Router } from 'express';
import {
  acceptAssignment,
  assignedOrders,
  history,
  updateDeliveryStatus,
  updateLocation,
} from '../controllers/deliveryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(protect, authorize(ROLES.DELIVERY_PARTNER, ROLES.ADMIN));

router.get('/orders', assignedOrders);
router.get('/history', history);
router.post('/orders/:id/accept', acceptAssignment);
router.patch('/orders/:id/status', updateDeliveryStatus);
router.patch('/location', updateLocation);

export default router;

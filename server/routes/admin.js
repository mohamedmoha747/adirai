import { Router } from 'express';
import {
  assignDelivery,
  dashboard,
  getCustomer,
  listCustomers,
  listDeliveryPartners,
  listOrders,
  reports,
  toggleShop,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { updateStatus } from '../controllers/orderController.js';
import { listShops } from '../controllers/shopController.js';

const router = Router();
router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', dashboard);
router.get('/orders', listOrders);
router.patch('/orders/:id/status', updateStatus);
router.post('/orders/:id/assign', assignDelivery);
router.get('/customers', listCustomers);
router.get('/customers/:id', getCustomer);
router.get('/delivery-partners', listDeliveryPartners);
router.get('/reports', reports);
router.get('/shops', listShops);
router.patch('/shops/:id', toggleShop);

export default router;

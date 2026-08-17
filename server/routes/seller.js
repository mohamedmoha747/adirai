import { Router } from 'express';
import {
  getMyShop,
  sellerOrders,
  sellerProducts,
  sellerSales,
  sellerUpdateStatus,
  upsertShop,
} from '../controllers/sellerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(protect, authorize(ROLES.SELLER, ROLES.ADMIN));

router.get('/shop', getMyShop);
router.put('/shop', upsertShop);
router.get('/products', sellerProducts);
router.get('/orders', sellerOrders);
router.patch('/orders/:id/status', sellerUpdateStatus);
router.get('/sales', sellerSales);

export default router;

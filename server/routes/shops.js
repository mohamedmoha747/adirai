import { Router } from 'express';
import { getShop, listShops } from '../controllers/shopController.js';
import { idParam } from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();
router.get('/', listShops);
router.get('/:id', idParam, validateRequest, getShop);

export default router;

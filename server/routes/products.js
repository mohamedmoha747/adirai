import { Router } from 'express';
import {
  addToCart,
  clearCart,
  createProduct,
  deleteProduct,
  getCart,
  getProduct,
  listProducts,
  removeCartItem,
  updateCartItem,
  updateProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { createProductValidator, idParam } from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', idParam, validateRequest, getProduct);
router.post('/', protect, authorize(ROLES.SELLER, ROLES.ADMIN), createProductValidator, validateRequest, createProduct);
router.patch('/:id', protect, authorize(ROLES.SELLER, ROLES.ADMIN), idParam, validateRequest, updateProduct);
router.delete('/:id', protect, authorize(ROLES.SELLER, ROLES.ADMIN), idParam, validateRequest, deleteProduct);

export const cartRouter = Router();
cartRouter.use(protect);
cartRouter.get('/', getCart);
cartRouter.post('/', addToCart);
cartRouter.patch('/:itemId', updateCartItem);
cartRouter.delete('/:itemId', removeCartItem);
cartRouter.delete('/', clearCart);

export default router;

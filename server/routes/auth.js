import { Router } from 'express';
import { login, me, register, updateProfile } from '../controllers/authController.js';
import { loginValidator, registerValidator } from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/me', protect, me);
router.patch('/profile', protect, updateProfile);

export default router;

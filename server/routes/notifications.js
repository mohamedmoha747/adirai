import { Router } from 'express';
import { markRead, myNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', myNotifications);
router.patch('/read', markRead);

export default router;

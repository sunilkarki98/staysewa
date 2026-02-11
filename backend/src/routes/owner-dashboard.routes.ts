import { Router } from 'express';
import { OwnerDashboardController } from '@/controllers/owner-dashboard.controller';
import { protect, restrictTo } from '@/middlewares/auth.middleware';

const router = Router();

// All owner dashboard routes are protected and restricted to 'owner'
router.use(protect);
router.use(restrictTo('owner'));

router.get('/stats', OwnerDashboardController.getStats);
router.get('/activity', OwnerDashboardController.getRecentActivity);

export default router;

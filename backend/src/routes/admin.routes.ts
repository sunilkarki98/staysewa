import { Router } from 'express';
import { AdminController } from '@/controllers/admin.controller';
import { protect, restrictTo } from '@/middlewares/auth.middleware';

const router = Router();

// All admin routes are protected and restricted
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', AdminController.getStats);
router.get('/activity', AdminController.getRecentActivity);

// Owner Management
router.get('/owners', AdminController.getAllOwners);
router.patch('/owners/:id/verify', AdminController.verifyOwner);
router.patch('/owners/:id/ban', AdminController.banOwner);

// Booking Audit
router.get('/bookings', AdminController.getAllBookings);

export default router;

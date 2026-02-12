import { Router } from 'express';
import propertiesRouter from '@/routes/properties.routes';
import bookingsRouter from '@/routes/bookings.routes';
import ownersRouter from '@/routes/owners.routes';
import customersRouter from '@/routes/customers.routes';
import userRoutes from '@/routes/user.routes';
import mediaRouter from '@/routes/media.routes';
import authRouter from '@/routes/auth.routes';
import paymentRoutes from '@/routes/payment.routes';
import adminRoutes from '@/routes/admin.routes';
import ownerDashboardRoutes from '@/routes/owner-dashboard.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/properties', propertiesRouter);
router.use('/bookings', bookingsRouter);
router.use('/owners', ownersRouter);
router.use('/customers', customersRouter);
router.use('/users', userRoutes);
router.use('/media', mediaRouter);
import { reviewsRouter } from '@/routes/reviews.routes';

router.use('/payments', paymentRoutes);
router.use('/reviews', reviewsRouter);
router.use('/admin', adminRoutes);
router.use('/owner/dashboard', ownerDashboardRoutes);

export default router;

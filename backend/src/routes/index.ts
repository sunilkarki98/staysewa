import { Router } from 'express';
import staysRouter from '@/routes/stays.routes';
import bookingsRouter from '@/routes/bookings.routes';
import ownersRouter from '@/routes/owners.routes';
import customersRouter from '@/routes/customers.routes';
import userRoutes from '@/routes/user.routes';
import mediaRouter from '@/routes/media.routes';
import authRouter from '@/routes/auth.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/stays', staysRouter);
router.use('/bookings', bookingsRouter);
router.use('/owners', ownersRouter);
router.use('/customers', customersRouter);
router.use('/users', userRoutes);
router.use('/media', mediaRouter);

export default router;

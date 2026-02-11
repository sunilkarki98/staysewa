import { Router } from 'express';
import { BookingsController } from '@/controllers/bookings.controller';
import { validate } from '@/middlewares/validate.middleware';
import { bookingSchema } from '@/validations/booking.schema';

import { protect } from '@/middlewares/auth.middleware';

const router = Router();

/**
 * Bookings Routes - Production ready setup
 */
router.get('/', BookingsController.getAllBookings);
router.get('/my', protect, BookingsController.getMyBookings);
router.get('/:id', validate(bookingSchema.updateStatus), BookingsController.getBooking);
router.post('/', validate(bookingSchema.createBooking), BookingsController.createBooking);
router.patch('/:id/status', validate(bookingSchema.updateStatus), BookingsController.updateBookingStatus);

export default router;

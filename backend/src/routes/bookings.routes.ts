import { Router } from 'express';
import { BookingsController } from '@/controllers/bookings.controller';
import { validate } from '@/middlewares/validate.middleware';
import { bookingSchema } from '@/validations/booking.schema';

import { protect, restrictTo } from '@/middlewares/auth.middleware';

const router = Router();

/**
 * Bookings Routes - Production ready setup
 */

// Admin only: View all system bookings
router.get('/', protect, restrictTo('admin'), BookingsController.getAllBookings);

// Customer: View their own bookings
router.get('/my', protect, BookingsController.getMyBookings);

// Owner: View bookings for their properties
router.get('/my-stays-bookings', protect, restrictTo('owner', 'admin'), BookingsController.getOwnerBookings);

// General Access (Protected)
router.get('/:id', protect, validate(bookingSchema.getBooking), BookingsController.getBooking);
router.post('/', protect, validate(bookingSchema.createBooking), BookingsController.createBooking);

// Owner/Admin: Update status (Accept/Reject/Check-in)
router.patch('/:id/status', protect, restrictTo('owner', 'admin'), validate(bookingSchema.updateStatus), BookingsController.updateBookingStatus);

export default router;

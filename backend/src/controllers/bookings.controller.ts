import type { Request, Response, NextFunction } from 'express';
import { BookingsService } from '@/services/booking.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

/**
 * Bookings Controller - Modular SaaS pattern
 */
export const BookingsController = {
    /**
     * Get all bookings
     */
    getAllBookings: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const bookings = await BookingsService.getAll();
        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings },
        });
    }),

    /**
     * Get a single booking
     */
    getBooking: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) {
            return next(new AppError('Booking ID is required', 400));
        }

        const booking = await BookingsService.getById(id as string);

        if (!booking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { booking },
        });
    }),

    /**
     * Create a new booking
     */
    createBooking: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const newBooking = await BookingsService.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { booking: newBooking },
        });
    }),

    /**
     * Update booking status
     */
    updateBookingStatus: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return next(new AppError('Status is required', 400));
        }

        const updatedBooking = await BookingsService.updateStatus(id as string, status);

        if (!updatedBooking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { booking: updatedBooking },
        });
    }),
};

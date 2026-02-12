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
    getAllBookings: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
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
        const { property_id, unit_id, check_in, check_out } = req.body;

        if (!property_id || !check_in || !check_out) {
            return next(new AppError('Missing required fields: property_id, check_in, check_out', 400));
        }

        const user = (req as any).user;

        const bookingData = {
            ...req.body,
            customer_id: user ? user.id : undefined,
            // status handled by service (default: reserved)
        };

        const newBooking = await BookingsService.create(bookingData);

        res.status(201).json({
            status: 'success',
            data: { booking: newBooking },
        });
    }),

    /**
     * Update booking status (with authorization)
     */
    updateBookingStatus: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status, cancellation_reason } = req.body;

        if (!status) {
            return next(new AppError('Status is required', 400));
        }

        // Authorization: verify the user owns this booking or is admin
        const user = (req as any).user;
        if (user) {
            const booking = await BookingsService.getById(id as string);
            if (!booking) return next(new AppError('Booking not found', 404));

            const isOwner = booking.owner_id === user.id;
            const isCustomer = booking.customer_id === user.id;
            const isAdmin = user.role === 'admin';

            if (!isOwner && !isCustomer && !isAdmin) {
                return next(new AppError('Not authorized to modify this booking', 403));
            }
        }

        const updatedBooking = await BookingsService.transitionStatus(id as string, status, {
            cancelled_by: user?.role || 'system',
            cancellation_reason,
        });

        if (!updatedBooking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { booking: updatedBooking },
        });
    }),

    /**
     * Get my bookings
     */
    getMyBookings: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        const bookings = await BookingsService.getMyBookings((req as any).user.id);

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings },
        });
    }),

    /**
     * Get owner's bookings (RBAC: Owner only)
     */
    getOwnerBookings: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        const bookings = await BookingsService.getBookingsByOwner((req as any).user.id);

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings },
        });
    }),
};

import { z } from 'zod';

export const bookingSchema = {
    createBooking: z.object({
        body: z.object({
            stayId: z.string().uuid('Invalid Stay ID'),
            unitId: z.string().uuid('Invalid Unit ID'),
            checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid check-in date format (YYYY-MM-DD)'),
            checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid check-out date format (YYYY-MM-DD)'),
            totalAmount: z.number().positive('Total amount must be positive'),
        }),
    }),

    updateStatus: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Booking ID'),
        }),
        body: z.object({
            status: z.string().min(1, 'Status is required'),
        }),
    }),
};

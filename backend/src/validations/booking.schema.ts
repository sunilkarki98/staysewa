import { z } from 'zod';

export const bookingSchema = {
    createBooking: z.object({
        body: z.object({
            stayId: z.uuid('Invalid Stay ID'),
            unitId: z.uuid('Invalid Unit ID'),
            checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid check-in date format (YYYY-MM-DD)'),
            checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid check-out date format (YYYY-MM-DD)'),
            totalAmount: z.number().positive('Total amount must be positive'),
        }),
    }),

    updateStatus: z.object({
        params: z.object({
            id: z.uuid('Invalid Booking ID'),
        }),
        body: z.object({
            status: z.enum(['pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show']),
        }),
    }),
};

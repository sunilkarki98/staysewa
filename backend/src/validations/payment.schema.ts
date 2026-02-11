import { z } from 'zod';

export const paymentSchema = {
    initiate: z.object({
        body: z.object({
            bookingId: z.uuid('Invalid Booking ID'),
            amount: z.number().positive('Amount must be positive'),
        }),
    }),

    verify: z.object({
        body: z.object({
            pidx: z.string().min(1, 'PIDX is required'),
        }),
    }),
};

import { z } from 'zod';

export const staySchema = {
    createStay: z.object({
        body: z.object({
            name: z.string().min(3, 'Name must be at least 3 characters'),
            type: z.enum(['hostel', 'flat', 'homestay']),
            addressLine: z.string().min(5, 'Address is required'),
            city: z.string().min(2, 'City is required'),
            district: z.string().min(2, 'District is required'),
            basePrice: z.number().positive('Price must be positive'),
        }),
    }),

    getStay: z.object({
        params: z.object({
            id: z.uuid('Invalid Stay ID'),
        }),
    }),

    updateStay: z.object({
        params: z.object({
            id: z.uuid('Invalid Stay ID'),
        }),
        body: z.object({
            name: z.string().min(3, 'Name must be at least 3 characters').optional(),
            type: z.enum(['hostel', 'homestay', 'apartment', 'room', 'hostel']).optional(),
            addressLine: z.string().min(5, 'Address is required').optional(),
            basePrice: z.number().positive('Price must be positive').optional(),
        }),
    }),

    deleteStay: z.object({
        params: z.object({
            id: z.uuid('Invalid Stay ID'),
        }),
    }),
};

import { z } from 'zod';
import { stayTypeEnum, stayIntentEnum, unitTypeEnum } from '@/db/schema/enums';

// We need to define enums manually for Zod if not importing from Drizzle Zod helper
// OR just use string validation for simplicity if enums are complex to import
// adhering to the enums defined in db/schema/enums.ts

export const staySchema = {
    createStay: z.object({
        body: z.object({
            name: z.string().min(3, 'Name must be at least 3 characters'),
            type: z.enum(['hotel', 'homestay', 'apartment', 'room', 'hostel']), // Aligned with stayTypeEnum
            intent: z.enum(['short_stay', 'long_stay', 'both']).default('both'),

            // Location
            addressLine: z.string().min(3, 'Address is required'),
            city: z.string().min(2, 'City is required'),
            district: z.string().min(2, 'District is required'),
            province: z.string().optional(),

            basePrice: z.number().positive('Price must be positive'), // In Paisa
            maxGuests: z.number().int().positive().default(1),
            amenities: z.array(z.string()).default([]),
            rules: z.array(z.string()).default([]),
            description: z.string().optional(),
            checkInTime: z.string().optional(),
            checkOutTime: z.string().optional(),

            // Nested Units (for Hotels/Hostels)
            stayUnits: z.array(z.object({
                name: z.string().min(1),
                type: z.enum(['room', 'bed', 'private_room', 'entire_place', 'shared_room']), // Aligned with unitTypeEnum
                maxOccupancy: z.number().positive(),
                basePrice: z.number().positive(),
                quantity: z.number().int().positive().default(1),
                amenities: z.array(z.string()).default([]),
            })).optional(),
        }),
    }),

    getStay: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Stay ID'),
        }),
    }),

    updateStay: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Stay ID'),
        }),
        body: z.object({
            name: z.string().min(3).optional(),
            type: z.enum(['hotel', 'homestay', 'apartment', 'room', 'hostel']).optional(),
            basePrice: z.number().positive().optional(),
            addressLine: z.string().optional(),
            city: z.string().optional(),
            district: z.string().optional(),
            amenities: z.array(z.string()).optional(),
            rules: z.array(z.string()).optional(),
        }),
    }),

    deleteStay: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Stay ID'),
        }),
    }),
};

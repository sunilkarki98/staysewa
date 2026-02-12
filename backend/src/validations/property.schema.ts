import { z } from 'zod';

const unitTypes = ['private_room', 'shared_room', 'entire_place', 'bed', 'single_room', 'double_room'] as const;

export const propertySchema = {
    createProperty: z.object({
        body: z.object({
            name: z.string().min(3, 'Name must be at least 3 characters'),
            type: z.string().min(1, 'Property type is required'),

            // Location
            address_line: z.string().min(3, 'Address is required'),
            city: z.string().min(2, 'City is required'),
            district: z.string().min(2, 'District is required'),
            province: z.string().optional(),

            base_price: z.number().positive('Price must be positive'),
            max_guests: z.number().int().positive().default(1),
            bedrooms: z.number().int().min(0).default(0),
            bathrooms: z.number().int().min(0).default(0),
            amenities: z.array(z.string()).default([]),
            rules: z.array(z.string()).default([]),
            description: z.string().optional(),
            check_in_time: z.string().optional(),
            check_out_time: z.string().optional(),

            // Nested Units
            units: z.array(z.object({
                name: z.string().min(1),
                type: z.enum(unitTypes),
                max_occupancy: z.number().positive(),
                base_price: z.number().positive(),
                quantity: z.number().int().positive().default(1),
                amenities: z.array(z.string()).default([]),
            })).optional(),
        }).superRefine((data, ctx) => {
            if (data.units && data.units.length > 0) {
                const type = data.type.toLowerCase();

                if (type === 'hotel') {
                    const hasInvalid = data.units.some(u => ['shared_room', 'entire_place'].includes(u.type));
                    if (hasInvalid) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Hotels cannot have 'shared_room' or 'entire_place' units.",
                            path: ['units']
                        });
                    }
                }

                if (type === 'hostel') {
                    const hasInvalid = data.units.some(u => u.type === 'entire_place');
                    if (hasInvalid) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Hostels cannot have 'entire_place' units.",
                            path: ['units']
                        });
                    }
                }
            }
        }),
    }),

    getProperty: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Property ID'),
        }),
    }),

    updateProperty: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Property ID'),
        }),
        body: z.object({
            name: z.string().min(3).optional(),
            type: z.string().min(1).optional(),
            base_price: z.number().positive().optional(),
            max_guests: z.number().int().positive().optional(),
            bedrooms: z.number().int().min(0).optional(),
            bathrooms: z.number().int().min(0).optional(),
            address_line: z.string().optional(),
            city: z.string().optional(),
            district: z.string().optional(),
            amenities: z.array(z.string()).optional(),
            rules: z.array(z.string()).optional(),
        }),
    }),

    deleteProperty: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Property ID'),
        }),
    }),
};

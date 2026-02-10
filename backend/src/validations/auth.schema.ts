import { z } from 'zod';

export const authSchema = {
    signup: z.object({
        body: z.object({
            fullName: z.string().min(2, 'Full name must be at least 2 characters'),
            email: z.string().email('Invalid email address'),
            password: z.string().min(8, 'Password must be at least 8 characters'),
            role: z.enum(['customer', 'owner', 'admin']).optional(),
        }),
    }),

    login: z.object({
        body: z.object({
            email: z.string().email('Invalid email address'),
            password: z.string().min(1, 'Password is required'),
        }),
    }),
};

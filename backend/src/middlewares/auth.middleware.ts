import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import { db } from '@/db';
import { users } from '@/db/schema';
import { env } from '@/config/env';
import { redis } from '@/config/redis';

/**
 * Authentication Middleware
 */
export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2. Verification token
    // Supabase signs tokens with HS256 using the JWT Secret
    if (!env.SUPABASE_JWT_SECRET) {
        return next(new AppError('Server misconfiguration: Missing SUPABASE_JWT_SECRET', 500));
    }

    try {
        const decoded = jwt.verify(token, env.SUPABASE_JWT_SECRET) as {
            sub: string;
            email?: string;
            phone?: string;
            user_metadata?: { full_name?: string; avatar_url?: string;[key: string]: any };
            app_metadata?: { provider?: string;[key: string]: any };
        };

        const userId = decoded.sub;

        // 3. User Sync (JIT Provisioning)
        let currentUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!currentUser) {
            // Create user for the first time
            // Note: Supabase user ID is a UUID, which fits our schema
            const email = decoded.email || (decoded.phone ? `${decoded.phone}@phone.staysewa.com` : `no-email-${userId}@staysewa.com`);

            try {
                const newUser = await db.insert(users).values({
                    id: userId,
                    email: email,
                    fullName: decoded.user_metadata?.full_name || 'StaySewa User',
                    role: 'customer', // Default role
                    emailVerified: !!decoded.email,
                    password: null, // Managed by Supabase
                }).returning();

                currentUser = newUser[0];
            } catch (err: any) {
                // Handle race condition if two requests come simultaneously
                currentUser = await db.query.users.findFirst({
                    where: eq(users.id, userId),
                });
            }
        }

        if (!currentUser) {
            return next(new AppError('User could not be synced', 500));
        }

        req.user = currentUser;
        next();

    } catch (err) {
        return next(new AppError('Invalid token', 401));
    }
});

/**
 * Authorization Middleware
 */
export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

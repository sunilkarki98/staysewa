import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '@/db/index';
import { users } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

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
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };

    // 3. Check if user still exists
    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
    });

    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Grant access to protected route
    const { password, ...userWithoutPassword } = currentUser;
    req.user = userWithoutPassword;
    next();
});

/**
 * Authorization Middleware
 */
export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

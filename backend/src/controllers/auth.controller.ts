import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

/**
 * Auth Controller - Principal Engineer Implementation
 */
export const AuthController = {
    /**
     * Set JWT cookie in response
     */
    sendTokenCookie(user: any, statusCode: number, res: Response) {
        const token = AuthService.generateToken(user.id);

        const cookieOptions = {
            expires: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
        };

        res.cookie('jwt', token, cookieOptions);

        res.status(statusCode).json({
            status: 'success',
            token,
            data: { user },
        });
    },

    /**
     * User Signup
     */
    signup: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, fullName, role } = req.body;

        if (!email || !password || !fullName) {
            return next(new AppError('Please provide email, password and full name', 400));
        }

        const newUser = await AuthService.signup({
            email,
            password,
            fullName,
            role: role || 'customer',
        });

        AuthController.sendTokenCookie(newUser, 201, res);
    }),

    /**
     * User Login
     */
    login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const user = await AuthService.login(email, password);

        if (!user) {
            return next(new AppError('Incorrect email or password', 401));
        }

        AuthController.sendTokenCookie(user, 200, res);
    }),

    /**
     * User Logout
     */
    logout: (req: Request, res: Response) => {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json({ status: 'success' });
    },

    /**
     * Get Current User (Me)
     */
    getMe: (req: Request, res: Response) => {
        // @ts-ignore
        res.status(200).json({
            status: 'success',
            data: { user: req.user },
        });
    },
};

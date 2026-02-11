import type { Request, Response, NextFunction } from 'express';
import { OwnersService } from '@/services/owner.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

export const OwnerDashboardController = {
    /**
     * Get analytics for the logged-in owner
     */
    getStats: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // req.user is populated by the 'protect' middleware
        const ownerId = req.user?.id;

        if (!ownerId) {
            return next(new AppError('User context not found', 401));
        }

        const stats = await OwnersService.getDashboardStats(ownerId);

        res.status(200).json({
            status: 'success',
            data: { stats },
        });
    }),

    /**
     * Get recent activities for the logged-in owner
     */
    getRecentActivity: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const ownerId = req.user?.id;

        if (!ownerId) {
            return next(new AppError('User context not found', 401));
        }

        const activity = await OwnersService.getRecentActivity(ownerId);

        res.status(200).json({
            status: 'success',
            data: { activity },
        });
    }),
};

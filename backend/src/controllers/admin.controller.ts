import type { Request, Response } from 'express';
import { AdminService } from '@/services/admin.service';
import { catchAsync } from '@/utils/catchAsync';

export const AdminController = {
    /**
     * Get dashboard stats
     */
    getStats: catchAsync(async (req: Request, res: Response) => {
        const stats = await AdminService.getStats();
        res.status(200).json({
            status: 'success',
            data: { stats },
        });
    }),

    /**
     * Get recent activities
     */
    getRecentActivity: catchAsync(async (req: Request, res: Response) => {
        const activity = await AdminService.getRecentActivity();
        res.status(200).json({
            status: 'success',
            data: { activity },
        });
    }),
};

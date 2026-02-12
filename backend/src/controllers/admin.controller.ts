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

    /**
     * Get all owners
     */
    getAllOwners: catchAsync(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (req.query.search as string) || "";

        const result = await AdminService.getAllOwners(page, limit, search);

        res.status(200).json({
            status: 'success',
            data: result
        });
    }),

    /**
     * Verify owner
     */
    verifyOwner: catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        await AdminService.verifyOwner(id);

        res.status(200).json({
            status: 'success',
            message: 'Owner verified successfully'
        });
    }),

    /**
     * Ban/Unban user
     */
    banUser: catchAsync(async (req: Request, res: Response) => {
        const { ban } = req.body; // Expect { ban: true/false }
        const id = req.params.id as string;
        await AdminService.banUser(id, ban);

        res.status(200).json({
            status: 'success',
            message: `User ${ban ? 'banned' : 'unbanned'} successfully`
        });
    }),

    /**
     * Get all bookings (Audit)
     */
    getAllBookings: catchAsync(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await AdminService.getAllBookings(page, limit);

        res.status(200).json({
            status: 'success',
            data: result
        });
    })
};

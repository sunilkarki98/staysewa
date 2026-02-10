import type { Request, Response, NextFunction } from 'express';
import { StaysService } from '@/services/stay.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

/**
 * Stays Controller - Modular SaaS pattern
 */
export const StaysController = {
    /**
     * Get all stays
     */
    getAllStays: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const stays = await StaysService.getAll();
        res.status(200).json({
            status: 'success',
            results: stays.length,
            data: { stays },
        });
    }),

    /**
     * Get a single stay by ID
     */
    getStay: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) {
            return next(new AppError('Stay ID is required', 400));
        }

        const stay = await StaysService.getById(id as string);

        if (!stay) {
            return next(new AppError('No stay found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { stay },
        });
    }),
};

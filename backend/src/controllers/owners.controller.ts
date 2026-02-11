import type { Request, Response, NextFunction } from 'express';
import { OwnersService } from '@/services/owner.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

/**
 * Owners Controller - Modular SaaS pattern
 */
export const OwnersController = {
    /**
     * Get all owners
     */
    getAllOwners: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        const owners = await OwnersService.getAll();
        res.status(200).json({
            status: 'success',
            results: owners.length,
            data: { owners },
        });
    }),

    /**
     * Get a single owner
     */
    getOwner: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) {
            return next(new AppError('Owner ID is required', 400));
        }

        const owner = await OwnersService.getById(id as string);

        if (!owner) {
            return next(new AppError('No owner found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { owner },
        });
    }),

    /**
     * Create a new owner
     */
    createOwner: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        if (!email) {
            return next(new AppError('Email is required', 400));
        }

        const existingOwner = await OwnersService.getByEmail(email);
        if (existingOwner) {
            return next(new AppError('Owner with this email already exists', 400));
        }

        const newOwner = await OwnersService.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { owner: newOwner },
        });
    }),
};

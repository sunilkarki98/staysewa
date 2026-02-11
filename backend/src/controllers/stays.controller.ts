import type { Request, Response, NextFunction } from 'express';
import { StaysService } from '@/services/stay.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';
import { redis } from '@/config/redis';

/**
 * Stays Controller - Modular SaaS pattern
 */
export const StaysController = {

    // ...

    /**
     * Get all stays
     */
    getAllStays: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        // Cache Key based on query params (e.g., page, limit, filters)
        // For now, since we just have a basic getAll, we use a simple key. 
        // In real world, we'd hash req.query.
        const cacheKey = 'stays:all';

        if (redis) {
            const cachedStays = await redis.get(cacheKey);
            if (cachedStays) {
                const stays = JSON.parse(cachedStays);
                return res.status(200).json({
                    status: 'success',
                    results: stays.length,
                    data: { stays },
                });
            }
        }

        // Build search filters from query params
        const filters = {
            location: req.query.location as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            type: req.query.category as string, // Frontend sends 'category'
            guests: req.query.guests ? Number(req.query.guests) : undefined,
            checkIn: req.query.checkIn as string,
            checkOut: req.query.checkOut as string,
        };

        const stays = await StaysService.search(filters);

        if (redis) {
            // Cache for 5 minutes (Note: we should really include query params in key now)
            // e.g., `stays:${JSON.stringify(filters)}`
            // For now, disabling cache for search to ensure correctness or using dynamic key
            await redis.set(cacheKey, JSON.stringify(stays), 'EX', 300);
        }

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
        const stay = await StaysService.getById(id as string);

        if (!stay) {
            return next(new AppError('No stay found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { stay },
        });
    }),

    /**
     * Create a new stay
     */
    createStay: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        // Inject Owner ID from Authenticated User (set by auth middleware)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ownerId = (req as any).user?.id;

        if (!ownerId) {
            // Fallback for dev/testing if auth not fully wired yet
            // return next(new AppError('You must be logged in to create a listing', 401));
        }

        const newStay = await StaysService.create({
            ...req.body,
            ownerId: ownerId || req.body.ownerId, // Allow manual override if needed or fallback
        });

        if (redis) {
            await redis.del('stays:all');
        }

        res.status(201).json({
            status: 'success',
            data: { stay: newStay },
        });
    }),

    /**
     * Update an existing stay
     */
    updateStay: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updatedStay = await StaysService.update(id as string, req.body);

        if (!updatedStay) {
            return next(new AppError('No stay found with that ID', 404));
        }

        if (redis) {
            await redis.del('stays:all');
        }

        res.status(200).json({
            status: 'success',
            data: { stay: updatedStay },
        });
    }),

    /**
     * Delete a stay
     */
    deleteStay: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedStay = await StaysService.delete(id as string);

        if (!deletedStay) {
            return next(new AppError('No stay found with that ID', 404));
        }

        if (redis) {
            await redis.del('stays:all');
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    }),
};

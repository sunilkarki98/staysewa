import type { Request, Response, NextFunction } from 'express';
import { ReviewsService } from '@/services/reviews.service';
import { catchAsync } from '@/utils/catchAsync';

export const ReviewsController = {
    createReview: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { booking_id, overall_rating, comment } = req.body;

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        const review = await ReviewsService.create({
            booking_id,
            overall_rating,
            comment,
            reviewer_id: userId
        });

        res.status(201).json({
            status: 'success',
            data: { review }
        });
    }),

    getPropertyReviews: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { property_id } = req.params;
        const id = Array.isArray(property_id) ? property_id[0] : property_id;

        const reviews = await ReviewsService.getByProperty(id);
        const stats = await ReviewsService.getStats(id);

        res.status(200).json({
            status: 'success',
            data: {
                reviews,
                stats
            }
        });
    })
};

import type { Request, Response, NextFunction } from 'express';
import { ReviewsService } from '@/services/reviews.service';
import { catchAsync } from '@/utils/catchAsync';

export const ReviewsController = {
    createReview: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { bookingId, rating, comment } = req.body;

        // Assume user is attached by auth middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        const review = await ReviewsService.create({
            bookingId,
            rating,
            comment,
            userId
        });

        res.status(201).json({
            status: 'success',
            data: { review }
        });
    }),

    getStayReviews: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { stayId } = req.params;
        // Ensure stayId is a string
        const id = Array.isArray(stayId) ? stayId[0] : stayId;

        const reviews = await ReviewsService.getByStay(id);
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

import { Router } from 'express';
import { ReviewsController } from '@/controllers/reviews.controller';
import { protect, restrictTo } from '@/middlewares/auth.middleware';

const router = Router({ mergeParams: true });

// Protected routes to CREATE/UPDATE reviews
router.use(protect);

router.route('/')
    .post(restrictTo('customer'), ReviewsController.createReview);

// Public router for nested property reviews
const publicRouter = Router({ mergeParams: true });

publicRouter.route('/')
    .get(ReviewsController.getPropertyReviews);

export { router as reviewsRouter, publicRouter as publicReviewsRouter };

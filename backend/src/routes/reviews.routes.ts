import { Router } from 'express';
import { ReviewsController } from '@/controllers/reviews.controller';
import { protect, restrictTo } from '@/middlewares/auth.middleware';

const router = Router({ mergeParams: true });

// Protect all routes
router.use(protect);

router.route('/')
    .post(restrictTo('user'), ReviewsController.createReview);

// Public route to get reviews for a stay? 
// No, getting reviews for a stay usually happens on stay details page, which might be public.
// But we put `protect` above.
// If we want public access, we should move it above `protect` or restructure.
// Let's make getStayReviews public.

const publicRouter = Router({ mergeParams: true });

publicRouter.route('/stay/:stayId')
    .get(ReviewsController.getStayReviews);

export { router as reviewsRouter, publicRouter as publicReviewsRouter };

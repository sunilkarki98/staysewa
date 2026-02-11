import { Router } from 'express';
import { StaysController } from '@/controllers/stays.controller';
import { validate } from '@/middlewares/validate.middleware';
import { protect, restrictTo } from '@/middlewares/auth.middleware';
import { staySchema } from '@/validations/stay.schema';

import { publicReviewsRouter } from '@/routes/reviews.routes';

// ... existing imports

const router = Router();

// Nested routes
router.use('/:stayId/reviews', publicReviewsRouter);

/**
 * Stays Routes - Production ready setup
 */
router.get('/', StaysController.getAllStays);
// ... existing routes
router.get('/:id', validate(staySchema.getStay), StaysController.getStay);

// Protected Management Routes
router.use(protect);
router.post('/', restrictTo('owner', 'admin'), validate(staySchema.createStay), StaysController.createStay);
router.patch('/:id', restrictTo('owner', 'admin'), validate(staySchema.updateStay), StaysController.updateStay);
router.delete('/:id', restrictTo('owner', 'admin'), validate(staySchema.deleteStay), StaysController.deleteStay);

export default router;

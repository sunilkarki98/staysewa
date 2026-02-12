import { Router } from 'express';
import { PropertiesController } from '@/controllers/properties.controller';
import { validate } from '@/middlewares/validate.middleware';
import { protect, restrictTo } from '@/middlewares/auth.middleware';
import { propertySchema } from '@/validations/property.schema';

import { publicReviewsRouter } from '@/routes/reviews.routes';

const router = Router();

// Nested routes
router.use('/:property_id/reviews', publicReviewsRouter);

/**
 * Properties Routes - Production ready setup
 */
router.get('/', PropertiesController.getAllProperties);
router.get('/:id', validate(propertySchema.getProperty), PropertiesController.getProperty);

// Protected Management Routes
router.use(protect);
router.post('/', restrictTo('owner', 'admin'), validate(propertySchema.createProperty), PropertiesController.createProperty);
router.patch('/:id', restrictTo('owner', 'admin'), validate(propertySchema.updateProperty), PropertiesController.updateProperty);
router.delete('/:id', restrictTo('owner', 'admin'), validate(propertySchema.deleteProperty), PropertiesController.deleteProperty);

export default router;

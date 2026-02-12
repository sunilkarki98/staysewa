import { Router } from 'express';
import { OwnersController } from '@/controllers/owners.controller';
import { protect, restrictTo } from '@/middlewares/auth.middleware';

const router = Router();

/**
 * Owners Routes - Production ready setup
 */
router.get('/', OwnersController.getAllOwners);
router.get('/:id', OwnersController.getOwner);
router.post('/', OwnersController.createOwner);

// Protected Owner Routes
router.use(protect);
router.use(restrictTo('owner'));

router.patch('/profile', OwnersController.updateProfile);

export default router;

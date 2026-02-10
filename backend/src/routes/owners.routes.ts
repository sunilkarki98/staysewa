import { Router } from 'express';
import { OwnersController } from '@/controllers/owners.controller';

const router = Router();

/**
 * Owners Routes - Production ready setup
 */
router.get('/', OwnersController.getAllOwners);
router.get('/:id', OwnersController.getOwner);
router.post('/', OwnersController.createOwner);

export default router;

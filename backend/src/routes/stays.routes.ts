import { Router } from 'express';
import { StaysController } from '@/controllers/stays.controller';
import { validate } from '@/middlewares/validate.middleware';
import { staySchema } from '@/validations/stay.schema';

const router = Router();

/**
 * Stays Routes - Production ready setup
 */
router.get('/', StaysController.getAllStays);
router.get('/:id', validate(staySchema.getStay), StaysController.getStay);

export default router;

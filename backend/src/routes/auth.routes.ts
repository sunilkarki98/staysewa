import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { authSchema } from '@/validations/auth.schema';

const router = Router();

router.post('/signup', validate(authSchema.signup), AuthController.signup);
router.post('/login', validate(authSchema.login), AuthController.login);
router.get('/logout', AuthController.logout);

/**
 * Protected routes
 */
router.get('/me', protect, AuthController.getMe);

export default router;

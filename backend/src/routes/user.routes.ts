import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { IdentityController } from '@/controllers/identity.controller';
import { protect } from '@/middlewares/auth.middleware';
import { upload } from '@/middlewares/upload.middleware';

const router = Router();

/**
 * @route GET /api/users/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', UserController.getProfile);

/**
 * @route GET /api/users
 * @desc List all users
 * @access Private/Admin
 */
router.get('/', protect, UserController.listUsers);

/**
 * @route POST /api/users/verify/id-card
 * @desc Upload front or back ID card
 * @access Private
 */
router.post('/verify/id-card', protect, upload.single('id_card'), IdentityController.uploadIdCard);

export default router;

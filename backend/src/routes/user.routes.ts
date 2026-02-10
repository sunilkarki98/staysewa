import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';

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
router.get('/', UserController.listUsers);

export default router;

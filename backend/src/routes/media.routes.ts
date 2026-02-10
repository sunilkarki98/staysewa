import { Router } from 'express';
import { MediaController } from '@/controllers/media.controller';

const router = Router();

/**
 * Media Management Routes
 */

// Global media operations
router.post('/', MediaController.uploadMedia);
router.delete('/:id', MediaController.removeMedia);
router.patch('/:id/cover', MediaController.setCover);

// Stay specific media
router.get('/stays/:stayId', MediaController.getStayMedia);

// Unit specific media
router.get('/units/:unitId', MediaController.getUnitMedia);

export default router;

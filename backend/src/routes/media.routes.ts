import { Router } from 'express';
import { MediaController } from '@/controllers/media.controller';

const router = Router();

/**
 * Media Management Routes
 */

import { upload } from '@/middlewares/upload.middleware';

// Global media operations
router.post('/', upload.single('file'), MediaController.uploadMedia);
router.delete('/:id', MediaController.removeMedia);
router.patch('/:id/cover', MediaController.setCover);

// Stay specific media
router.get('/stays/:stayId', MediaController.getStayMedia);

// Unit specific media
router.get('/units/:unitId', MediaController.getUnitMedia);

export default router;

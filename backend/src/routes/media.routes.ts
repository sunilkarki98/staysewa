import { Router } from 'express';
import { MediaController } from '@/controllers/media.controller';
import { upload } from '@/middlewares/upload.middleware';

const router = Router();

/**
 * Media Management Routes
 */

// Global media operations
router.post('/', upload.single('file'), MediaController.uploadMedia);
router.delete('/:id', MediaController.removeMedia);
router.patch('/:id/cover', MediaController.setCover);

// Property specific media
router.get('/properties/:property_id', MediaController.getPropertyMedia);

// Unit specific media
router.get('/units/:unit_id', MediaController.getUnitMedia);

export default router;

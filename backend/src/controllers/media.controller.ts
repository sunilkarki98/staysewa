import type { Request, Response, NextFunction } from 'express';
import { MediaService } from '@/services/media.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

/**
 * Media Controller - Professional SaaS Pattern
 */
export const MediaController = {
    /**
     * Save a new media record (URL based)
     */
    uploadMedia: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { stayId, unitId, type, caption, isCover } = req.body;
        let { url } = req.body;

        if (req.file) {
            // Construct URL for the uploaded file
            // Assuming the server is reachable via the host header
            // For production, this should likely be an Env Var e.g. ASSET_URL
            url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        if (!stayId || !url) {
            // Clean up file if validation fails (optional but good practice)
            return next(new AppError('Stay ID and URL/File are required', 400));
        }

        const media = await MediaService.addMedia({
            stayId,
            unitId: unitId || null,
            url,
            type: type || 'image',
            caption,
            isCover: isCover === 'true' || isCover === true, // Form data might imply string "true"
        });

        res.status(201).json({
            status: 'success',
            data: { media },
        });
    }),

    /**
     * Get media for a stay
     */
    getStayMedia: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { stayId } = req.params;
        const { propertyOnly } = req.query;

        if (!stayId) {
            return next(new AppError('Stay ID is required', 400));
        }

        const media = await MediaService.getMediaByStay(
            stayId as string,
            propertyOnly === 'true'
        );

        res.status(200).json({
            status: 'success',
            results: media.length,
            data: { media },
        });
    }),

    /**
     * Get media for a specific unit (room)
     */
    getUnitMedia: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { unitId } = req.params;

        if (!unitId) {
            return next(new AppError('Unit ID is required', 400));
        }

        const media = await MediaService.getMediaByUnit(unitId as string);

        res.status(200).json({
            status: 'success',
            results: media.length,
            data: { media },
        });
    }),

    /**
     * Set cover image
     */
    setCover: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { stayId, unitId } = req.body;

        if (!stayId) {
            return next(new AppError('Stay ID is required in body', 400));
        }

        const media = await MediaService.setCover(id as string, stayId as string, unitId as string);

        res.status(200).json({
            status: 'success',
            data: { media },
        });
    }),

    /**
     * Delete media
     */
    removeMedia: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const media = await MediaService.deleteMedia(id as string);

        if (!media) {
            return next(new AppError('No media found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    }),
};

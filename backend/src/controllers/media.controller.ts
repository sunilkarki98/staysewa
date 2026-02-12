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
        const { property_id, unit_id, type, label, is_cover } = req.body;
        let { url } = req.body;

        if (req.file) {
            // Upload to Supabase Storage
            // Folder structure: properties/{property_id} or properties/{property_id}/units/{unit_id}
            const folder = unit_id ? `properties/${property_id}/units/${unit_id}` : `properties/${property_id}`;
            url = await MediaService.uploadToSupabase(req.file, folder, 'property-media');
        }

        if (!url && !req.file) {
            return next(new AppError('URL or File is required', 400));
        }

        // If no property_id, just return the uploaded URL (for "Add Listing" wizard)
        if (!property_id) {
            return res.status(201).json({
                status: 'success',
                data: {
                    url,
                    message: 'File uploaded successfully (not saved to DB yet)',
                    media: { url },
                },
            });
        }

        const media = await MediaService.addMedia({
            property_id,
            unit_id: unit_id || null,
            url,
            type: type || 'image',
            label: label || null,
            is_cover: is_cover === 'true' || is_cover === true,
        });

        res.status(201).json({
            status: 'success',
            data: { media },
        });
    }),

    /**
     * Get media for a property
     */
    getPropertyMedia: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { property_id } = req.params;
        const { propertyOnly } = req.query;

        if (!property_id) {
            return next(new AppError('Property ID is required', 400));
        }

        const media = await MediaService.getMediaByProperty(
            property_id as string,
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
        const { unit_id } = req.params;

        if (!unit_id) {
            return next(new AppError('Unit ID is required', 400));
        }

        const media = await MediaService.getMediaByUnit(unit_id as string);

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
        const { property_id, unit_id } = req.body;

        if (!property_id) {
            return next(new AppError('Property ID is required in body', 400));
        }

        const media = await MediaService.setCover(id as string, property_id as string, unit_id as string);

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

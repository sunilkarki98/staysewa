import type { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';
import { MediaService } from '@/services/media.service';
import { db } from '@/db';
import { ownerProfiles, customerProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const IdentityController = {
    /**
     * @desc Upload ID card (front or back) and update respective profile
     * @route POST /api/users/verify/id-card
     * @access Private
     */
    uploadIdCard: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            return next(new AppError('Please provide an ID card image', 400));
        }

        const { side } = req.body; // 'front' or 'back'
        if (!['front', 'back'].includes(side)) {
            return next(new AppError('Please specify the side of the ID card (front or back)', 400));
        }

        const user = req.user;
        if (!user) {
            return next(new AppError('Authentication required', 401));
        }

        // 1. Upload to PRIVATE Supabase bucket
        // Folder structure: id-cards/{userId}
        const bucket = 'verification-docs';
        const folder = `id-cards/${user.id}`;

        const url = await MediaService.uploadToSupabase(req.file, folder, bucket);

        // 2. Update DB Profile based on user role
        // We handle both Owner and Customer profiles depending on which exists
        let updated = false;

        const updateData = side === 'front' ? { idFrontUrl: url } : { idBackUrl: url };

        if (user.role === 'owner') {
            await db.update(ownerProfiles)
                .set(updateData)
                .where(eq(ownerProfiles.userId, user.id));
            updated = true;
        } else if (user.role === 'customer') {
            await db.update(customerProfiles)
                .set(updateData)
                .where(eq(customerProfiles.userId, user.id));
            updated = true;
        }

        if (!updated) {
            return next(new AppError('User profile not found for verification', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                side,
                url,
                message: `ID card ${side} uploaded successfully to private storage.`
            }
        });
    })
};

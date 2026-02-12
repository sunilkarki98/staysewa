import { db } from '@/db/index';
import { stayMedia } from '@/db/schema/index';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Media Service - Principal Engineer Implementation
 * Handles business logic for stay and unit media assets.
 */
export const MediaService = {
    /**
     * Upload file to Supabase Storage
     */
    async uploadToSupabase(
        file: Express.Multer.File,
        folder: string = 'stays',
        bucket: string = 'stay-media'
    ): Promise<string> {
        const { supabase } = await import('@/lib/supabase'); // Dynamic import to avoid circular dependency if any

        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            throw new Error(`Supabase upload failed: ${error.message}`);
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    /**
     * Add a new media asset
     */
    async addMedia(data: typeof stayMedia.$inferInsert) {
        const result = await db.insert(stayMedia).values(data).returning();
        return result[0];
    },

    /**
     * Get all media for a specific stay (Property level only if unitId is null)
     */
    async getMediaByStay(stayId: string, propertyOnly = false) {
        const query = propertyOnly
            ? and(eq(stayMedia.stayId, stayId), isNull(stayMedia.unitId))
            : eq(stayMedia.stayId, stayId);

        return await db.select().from(stayMedia).where(query).orderBy(stayMedia.sortOrder);
    },

    /**
     * Get all media for a specific stay unit (Room level)
     */
    async getMediaByUnit(unitId: string) {
        return await db
            .select()
            .from(stayMedia)
            .where(eq(stayMedia.unitId, unitId))
            .orderBy(stayMedia.sortOrder);
    },

    /**
     * Delete a media asset
     */
    async deleteMedia(id: string) {
        const result = await db.delete(stayMedia).where(eq(stayMedia.id, id)).returning();
        return result[0];
    },

    /**
     * Set an image as the cover for a stay or unit
     * Ensures only one cover exists for the given context
     */
    async setCover(id: string, stayId: string, unitId?: string) {
        return await db.transaction(async (tx) => {
            // 1. Remove cover flag from all other media in this context
            const contextQuery = unitId
                ? and(eq(stayMedia.stayId, stayId), eq(stayMedia.unitId, unitId))
                : and(eq(stayMedia.stayId, stayId), isNull(stayMedia.unitId));

            await tx.update(stayMedia).set({ isCover: false }).where(contextQuery);

            // 2. Set new cover
            const result = await tx
                .update(stayMedia)
                .set({ isCover: true })
                .where(eq(stayMedia.id, id))
                .returning();

            return result[0];
        });
    },

    /**
     * Update media metadata (caption, sort order, etc.)
     */
    async updateMedia(id: string, data: Partial<typeof stayMedia.$inferInsert>) {
        const result = await db
            .update(stayMedia)
            .set({ ...data })
            .where(eq(stayMedia.id, id))
            .returning();
        return result[0];
    }
};

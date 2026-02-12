import { db } from '@/db/index';
import { propertyMedia } from '@/db/schema/index';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Media Service - Principal Engineer Implementation
 * Handles business logic for property and unit media assets.
 */
export const MediaService = {
    /**
     * Upload file to Supabase Storage
     */
    async uploadToSupabase(
        file: Express.Multer.File,
        folder: string = 'properties',
        bucket: string = 'property-media'
    ): Promise<string> {
        const { supabase } = await import('@/lib/supabase');

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
    async addMedia(data: typeof propertyMedia.$inferInsert) {
        const result = await db.insert(propertyMedia).values(data).returning();
        return result[0];
    },

    /**
     * Get all media for a specific property (Property level only if unitId is null)
     */
    async getMediaByProperty(propertyId: string, propertyOnly = false) {
        const query = propertyOnly
            ? and(eq(propertyMedia.property_id, propertyId), isNull(propertyMedia.unit_id))
            : eq(propertyMedia.property_id, propertyId);

        return await db.select().from(propertyMedia).where(query).orderBy(propertyMedia.sort_order);
    },

    /**
     * Get all media for a specific unit (Room level)
     */
    async getMediaByUnit(unitId: string) {
        return await db
            .select()
            .from(propertyMedia)
            .where(eq(propertyMedia.unit_id, unitId))
            .orderBy(propertyMedia.sort_order);
    },

    /**
     * Delete a media asset
     */
    async deleteMedia(id: string) {
        const result = await db.delete(propertyMedia).where(eq(propertyMedia.id, id)).returning();
        return result[0];
    },

    /**
     * Set an image as the cover for a property or unit
     */
    async setCover(id: string, propertyId: string, unitId?: string) {
        return await db.transaction(async (tx) => {
            const contextQuery = unitId
                ? and(eq(propertyMedia.property_id, propertyId), eq(propertyMedia.unit_id, unitId))
                : and(eq(propertyMedia.property_id, propertyId), isNull(propertyMedia.unit_id));

            await tx.update(propertyMedia).set({ is_cover: false }).where(contextQuery);

            const result = await tx
                .update(propertyMedia)
                .set({ is_cover: true })
                .where(eq(propertyMedia.id, id))
                .returning();

            return result[0];
        });
    },

    /**
     * Update media metadata
     */
    async updateMedia(id: string, data: Partial<typeof propertyMedia.$inferInsert>) {
        const result = await db
            .update(propertyMedia)
            .set({ ...data })
            .where(eq(propertyMedia.id, id))
            .returning();
        return result[0];
    }
};

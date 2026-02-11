import { db } from '@/db/index';
import { stays, stayUnits, stayMedia } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export const StaysService = {
    async getAll() {
        return await db.select().from(stays);
    },

    async getById(id: string) {
        // Use query builder to fetch relations
        const result = await db.query.stays.findFirst({
            where: eq(stays.id, id),
            with: {
                stayUnits: true,
                stayMedia: true,
            },
        });
        return result || null;
    },

    async create(data: typeof stays.$inferInsert & { stayUnits?: typeof stayUnits.$inferInsert[]; images?: string[] }) {
        return await db.transaction(async (tx) => {
            // 1. Generate Slug
            const baseSlug = slugify(data.name, { lower: true, strict: true });
            const slug = `${baseSlug}-${uuidv4().slice(0, 8)}`;

            // 2. Separate units and images from main stay data
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { stayUnits: units, images, ...stayData } = data;

            // 3. Insert Stay
            const [newStay] = await tx.insert(stays).values({
                ...stayData,
                slug,
            }).returning();

            // 4. Insert Units (if any)
            if (units && units.length > 0) {
                const unitsWithStayId = units.map(unit => ({
                    ...unit,
                    stayId: newStay.id,
                }));
                await tx.insert(stayUnits).values(unitsWithStayId);
            }

            // 5. Insert Images (if any)
            if (images && images.length > 0) {
                const mediaRecords = images.map((url, index) => ({
                    stayId: newStay.id,
                    url,
                    type: 'image' as const,
                    sortOrder: index,
                    isCover: index === 0, // First image is cover
                }));
                await tx.insert(stayMedia).values(mediaRecords);
            }

            return newStay;
        });
    },

    async update(id: string, data: Partial<typeof stays.$inferInsert>) {
        const result = await db
            .update(stays)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(stays.id, id))
            .returning();
        return result[0];
    },

    async delete(id: string) {
        const result = await db.delete(stays).where(eq(stays.id, id)).returning();
        return result[0];
    },
};

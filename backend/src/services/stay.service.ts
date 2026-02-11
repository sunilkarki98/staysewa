import { db } from '@/db/index';
import { stays } from '@/db/schema/index';
import { eq } from 'drizzle-orm';

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
                // priceRules: true, // Potential future addition
                // cancellationPolicy: true, // Potential future addition
            },
        });
        return result || null;
    },

    async create(data: typeof stays.$inferInsert) {
        const result = await db.insert(stays).values(data).returning();
        return result[0];
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

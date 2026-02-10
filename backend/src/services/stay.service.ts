import { db } from '@/db/index';
import { stays } from '@/db/schema/index';
import { eq } from 'drizzle-orm';

export const StaysService = {
    async getAll() {
        return await db.select().from(stays);
    },

    async getById(id: string) {
        const result = await db.select().from(stays).where(eq(stays.id, id));
        return result[0] || null;
    },

    // Add create, update, delete methods...
};

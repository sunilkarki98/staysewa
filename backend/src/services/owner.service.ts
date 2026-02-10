import { db } from '@/db/index';
import { users } from '@/db/schema/index';
import { eq, and } from 'drizzle-orm';

export const OwnersService = {
    async getAll() {
        return await db.select().from(users).where(eq(users.role, 'owner'));
    },

    async getById(id: string) {
        const result = await db.select().from(users).where(and(eq(users.id, id), eq(users.role, 'owner')));
        return result[0] || null;
    },

    async create(data: typeof users.$inferInsert) {
        // Enforce role owner
        const userData = { ...data, role: 'owner' as const };
        const result = await db.insert(users).values(userData).returning();
        return result[0];
    },

    async getByEmail(email: string) {
        const result = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, 'owner')));
        return result[0] || null;
    }
};

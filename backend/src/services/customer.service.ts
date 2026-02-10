import { db } from '@/db/index';
import { users } from '@/db/schema/index';
import { eq, and } from 'drizzle-orm';

export const CustomersService = {
    async getAll() {
        return await db.select().from(users).where(eq(users.role, 'customer'));
    },

    async getById(id: string) {
        const result = await db.select().from(users).where(and(eq(users.id, id), eq(users.role, 'customer')));
        return result[0] || null;
    },

    async create(data: typeof users.$inferInsert) {
        // Enforce role customer
        const userData = { ...data, role: 'customer' as const };
        const result = await db.insert(users).values(userData).returning();
        return result[0];
    },

    async getByEmail(email: string) {
        const result = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, 'customer')));
        return result[0] || null;
    }
};

import { db } from '@/db/index';
import { users, bookings, payments, properties } from '@/db/schema/index';
import { eq, and, sql, count } from 'drizzle-orm';

export const OwnersService = {
    /**
     * Get isolated analytics for a specific owner
     */
    async getDashboardStats(ownerId: string) {
        // 1. Total Properties count
        const [propertyCount] = await db.select({ value: count() })
            .from(properties)
            .where(eq(properties.owner_id, ownerId));

        // 2. Total Bookings count
        const [bookingCount] = await db.select({ value: count() })
            .from(bookings)
            .where(eq(bookings.owner_id, ownerId));

        // 3. Total Revenue for this owner
        const [revenue] = await db.select({
            total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`
        })
            .from(payments)
            .innerJoin(bookings, eq(payments.booking_id, bookings.id))
            .where(and(
                eq(bookings.owner_id, ownerId),
                eq(payments.status, 'completed')
            ));

        return {
            properties: propertyCount.value,
            bookings: bookingCount.value,
            revenue: revenue.total,
        };
    },

    /**
     * Get recent activities for this owner only
     */
    async getRecentActivity(ownerId: string, limit = 5) {
        return await db.select({
            id: bookings.id,
            guest_name: bookings.guest_name,
            status: bookings.status,
            amount: bookings.total_amount,
            check_in: bookings.check_in,
            property_name: properties.name,
        })
            .from(bookings)
            .innerJoin(properties, eq(bookings.property_id, properties.id))
            .where(eq(bookings.owner_id, ownerId))
            .limit(limit)
            .orderBy(sql`${bookings.created_at} DESC`);
    },

    async getAll() {
        return await db.select().from(users).where(eq(users.role, 'owner'));
    },

    async getById(id: string) {
        const result = await db.select().from(users).where(and(eq(users.id, id), eq(users.role, 'owner')));
        return result[0] || null;
    },

    async create(data: typeof users.$inferInsert) {
        const userData = { ...data, role: 'owner' as const };
        const result = await db.insert(users).values(userData).returning();
        return result[0];
    },

    async getByEmail(email: string) {
        const result = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, 'owner')));
        return result[0] || null;
    },

    // Legacy updateProfile refactored to use users table directly
    async updateProfile(userId: string, data: Partial<typeof users.$inferInsert>) {
        const result = await db
            .update(users)
            .set({ ...data, updated_at: new Date() })
            .where(eq(users.id, userId))
            .returning();
        return result[0];
    }
};

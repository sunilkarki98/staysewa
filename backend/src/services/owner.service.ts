import { db } from '@/db/index';
import { users, bookings, payments, stays } from '@/db/schema/index';
import { eq, and, sql, count } from 'drizzle-orm';

export const OwnersService = {
    /**
     * Get isolated analytics for a specific owner
     */
    async getDashboardStats(ownerId: string) {
        // 1. Total Stays count
        const [stayCount] = await db.select({ value: count() })
            .from(stays)
            .where(eq(stays.ownerId, ownerId));

        // 2. Total Bookings count
        const [bookingCount] = await db.select({ value: count() })
            .from(bookings)
            .where(eq(bookings.ownerId, ownerId));

        // 3. Total Revenue for this owner
        const [revenue] = await db.select({
            total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`
        })
            .from(payments)
            .innerJoin(bookings, eq(payments.bookingId, bookings.id))
            .where(and(
                eq(bookings.ownerId, ownerId),
                eq(payments.status, 'completed')
            ));

        return {
            stays: stayCount.value,
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
            guestName: bookings.guestName,
            status: bookings.status,
            amount: bookings.totalAmount,
            checkIn: bookings.checkIn,
            stayName: stays.name,
        })
            .from(bookings)
            .innerJoin(stays, eq(bookings.stayId, stays.id))
            .where(eq(bookings.ownerId, ownerId))
            .limit(limit)
            .orderBy(sql`${bookings.createdAt} DESC`);
    },

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

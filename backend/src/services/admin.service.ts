import { db } from '@/db/index';
import { users, bookings, payments, stays } from '@/db/schema/index';
import { eq, sql, count } from 'drizzle-orm';

export const AdminService = {
    /**
     * Get system-wide statistics for the admin dashboard
     */
    async getStats() {
        const [userCount] = await db.select({ value: count() }).from(users);
        const [bookingCount] = await db.select({ value: count() }).from(bookings);
        const [stayCount] = await db.select({ value: count() }).from(stays);

        // Aggregate revenue from payments
        const [revenue] = await db.select({
            total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`
        })
            .from(payments)
            .where(eq(payments.status, 'completed'));

        return {
            users: userCount.value,
            bookings: bookingCount.value,
            stays: stayCount.value,
            revenue: revenue.total,
        };
    },

    /**
     * Get recent activities across the system
     */
    async getRecentActivity(limit = 10) {
        // This would typically join audit_logs or just select recent bookings/users
        return await db.select({
            id: bookings.id,
            guestName: bookings.guestName,
            status: bookings.status,
            amount: bookings.totalAmount,
            createdAt: bookings.createdAt,
        })
            .from(bookings)
            .limit(limit)
            .orderBy(sql`${bookings.createdAt} DESC`);
    }
};

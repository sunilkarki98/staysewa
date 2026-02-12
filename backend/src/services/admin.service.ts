import { db } from '@/db/index';
import { users, bookings, payments, properties } from '@/db/schema/index';
import { eq, sql, count, desc, and, ilike, or } from 'drizzle-orm';

export const AdminService = {
    /**
     * Get system-wide statistics for the admin dashboard
     */
    async getStats() {
        const [userCount] = await db.select({ count: count() }).from(users);
        const [bookingCount] = await db.select({ count: count() }).from(bookings);
        const [propertyCount] = await db.select({ count: count() }).from(properties);

        // Aggregate revenue from payments
        const [revenue] = await db.select({
            total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`
        })
            .from(payments)
            .where(eq(payments.status, 'completed'));

        return {
            users: userCount.count,
            bookings: bookingCount.count,
            properties: propertyCount.count,
            revenue: revenue.total,
        };
    },

    /**
     * Get recent activities across the system
     */
    async getRecentActivity(limit = 10) {
        return await db.select({
            id: bookings.id,
            guest_name: bookings.guest_name,
            status: bookings.status,
            amount: bookings.total_amount,
            created_at: bookings.created_at,
        })
            .from(bookings)
            .limit(limit)
            .orderBy(sql`${bookings.created_at} DESC`);
    },

    /**
     * Get all owners with pagination and search
     */
    async getAllOwners(page = 1, limit = 10, search = "") {
        const offset = (page - 1) * limit;

        const whereClause = and(
            eq(users.role, 'owner'),
            search ? or(ilike(users.full_name, `%${search}%`), ilike(users.email, `%${search}%`)) : undefined
        );

        const ownersList = await db.select({
            id: users.id,
            name: users.full_name,
            email: users.email,
            avatar: users.avatar_url,
            is_active: users.is_active,
            created_at: users.created_at,
            verification_status: users.verification_status,
        })
            .from(users)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(users.created_at));

        const [countResult] = await db.select({ count: count() })
            .from(users)
            .where(whereClause);

        return {
            owners: ownersList,
            total: countResult.count,
            page,
            totalPages: Math.ceil(countResult.count / limit)
        };
    },

    /**
     * Verify an owner
     */
    async verifyOwner(userId: string) {
        return await db.update(users)
            .set({ verification_status: 'verified', updated_at: new Date() })
            .where(eq(users.id, userId))
            .returning();
    },

    /**
     * Ban or Unban a user
     */
    async banUser(userId: string, ban: boolean) {
        return await db.update(users)
            .set({ is_active: !ban, updated_at: new Date() })
            .where(eq(users.id, userId))
            .returning();
    },

    /**
     * Get all bookings for audit
     */
    async getAllBookings(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const bookingsList = await db.select({
            id: bookings.id,
            booking_number: bookings.booking_number,
            guest_name: bookings.guest_name,
            amount: bookings.total_amount,
            status: bookings.status,
            check_in: bookings.check_in,
            check_out: bookings.check_out,
            created_at: bookings.created_at,
            property_name: properties.name
        })
            .from(bookings)
            .leftJoin(properties, eq(bookings.property_id, properties.id))
            .limit(limit)
            .offset(offset)
            .orderBy(desc(bookings.created_at));

        const [countResult] = await db.select({ count: count() }).from(bookings);

        return {
            bookings: bookingsList,
            total: countResult.count,
            page,
            totalPages: Math.ceil(countResult.count / limit)
        };
    }
};

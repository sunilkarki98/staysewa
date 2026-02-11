import { db } from '@/db/index';
import { users, bookings, payments, stays, ownerProfiles } from '@/db/schema/index';
import { eq, sql, count, desc, and, ilike, or } from 'drizzle-orm';

export const AdminService = {
    /**
     * Get system-wide statistics for the admin dashboard
     */
    async getStats() {
        const [userCount] = await db.select({ count: count() }).from(users);
        const [bookingCount] = await db.select({ count: count() }).from(bookings);
        const [stayCount] = await db.select({ count: count() }).from(stays);

        // Aggregate revenue from payments
        const [revenue] = await db.select({
            total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`
        })
            .from(payments)
            .where(eq(payments.status, 'completed'));

        return {
            users: userCount.count,
            bookings: bookingCount.count,
            stays: stayCount.count,
            revenue: revenue.total,
        };
    },

    /**
     * Get recent activities across the system
     */
    async getRecentActivity(limit = 10) {
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
    },

    /**
     * Get all owners with pagination and search
     */
    async getAllOwners(page = 1, limit = 10, search = "") {
        const offset = (page - 1) * limit;

        const whereClause = and(
            eq(users.role, 'owner'),
            search ? or(ilike(users.fullName, `%${search}%`), ilike(users.email, `%${search}%`)) : undefined
        );

        const ownersList = await db.select({
            id: users.id,
            name: users.fullName,
            email: users.email,
            avatar: users.avatarUrl,
            isActive: users.isActive,
            createdAt: users.createdAt,
            businessName: ownerProfiles.businessName,
            verificationStatus: ownerProfiles.verificationStatus,
            totalEarnings: ownerProfiles.totalEarnings,
        })
            .from(users)
            .leftJoin(ownerProfiles, eq(users.id, ownerProfiles.userId))
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(users.createdAt));

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
     * Verify an owner (approve their documents)
     */
    async verifyOwner(userId: string) {
        const [profile] = await db.select().from(ownerProfiles).where(eq(ownerProfiles.userId, userId));

        if (!profile) {
            throw new Error('Owner profile not found');
        }

        return await db.update(ownerProfiles)
            .set({ verificationStatus: 'verified' })
            .where(eq(ownerProfiles.userId, userId))
            .returning();
    },

    /**
     * Ban or Unban an owner
     */
    async banOwner(userId: string, ban: boolean) {
        return await db.update(users)
            .set({ isActive: !ban })
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
            bookingNumber: bookings.bookingNumber,
            guestName: bookings.guestName,
            amount: bookings.totalAmount,
            status: bookings.status,
            checkIn: bookings.checkIn,
            checkOut: bookings.checkOut,
            createdAt: bookings.createdAt,
            stayName: stays.name
        })
            .from(bookings)
            .leftJoin(stays, eq(bookings.stayId, stays.id))
            .limit(limit)
            .offset(offset)
            .orderBy(desc(bookings.createdAt));

        const [countResult] = await db.select({ count: count() }).from(bookings);

        return {
            bookings: bookingsList,
            total: countResult.count,
            page,
            totalPages: Math.ceil(countResult.count / limit)
        };
    }
};

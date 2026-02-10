import { db } from '@/db/index';
import { bookings, stays } from '@/db/schema/index';
import { eq, desc } from 'drizzle-orm';

export const BookingsService = {
    async getAll() {
        return await db
            .select({
                id: bookings.id,
                guestName: bookings.guestName,
                guestEmail: bookings.guestEmail,
                guestPhone: bookings.guestPhone,
                checkIn: bookings.checkIn,
                checkOut: bookings.checkOut,
                status: bookings.status,
                totalAmount: bookings.totalAmount,
                createdAt: bookings.createdAt,
                stayName: stays.name, // Fetch property name
            })
            .from(bookings)
            .leftJoin(stays, eq(bookings.stayId, stays.id))
            .orderBy(desc(bookings.createdAt));
    },

    async getById(id: string) {
        const result = await db
            .select({
                // Select all booking fields + stayName
                id: bookings.id,
                guestName: bookings.guestName,
                guestEmail: bookings.guestEmail,
                guestPhone: bookings.guestPhone,
                checkIn: bookings.checkIn,
                checkOut: bookings.checkOut,
                status: bookings.status,
                totalAmount: bookings.totalAmount,
                createdAt: bookings.createdAt,
                stayName: stays.name,
                specialRequests: bookings.id, // Placeholder or add column if needed
            })
            .from(bookings)
            .leftJoin(stays, eq(bookings.stayId, stays.id))
            .where(eq(bookings.id, id));
        return result[0] || null;
    },

    async create(data: typeof bookings.$inferInsert) {
        const result = await db.insert(bookings).values(data).returning();
        return result[0];
    },

    async updateStatus(id: string, status: string) {
        // @ts-ignore - Drizzle enum type mismatch with string
        const result = await db
            .update(bookings)
            .set({ status: status as any })
            .where(eq(bookings.id, id))
            .returning();
        return result[0];
    },
};

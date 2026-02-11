import { db } from '@/db/index';
import { bookings, stays, stayUnits } from '@/db/schema/index';
import { eq, desc, and, lt, gt, ne, sql } from 'drizzle-orm';
import { AppError } from '@/utils/AppError';

export const BookingsService = {
    /**
     * Check if a unit is already booked for a given date range
     */
    async findOverlap(unitId: string, checkIn: string, checkOut: string) {
        return await db.query.bookings.findFirst({
            where: and(
                eq(bookings.unitId, unitId),
                ne(bookings.status, 'cancelled'),
                lt(bookings.checkIn, checkOut),
                gt(bookings.checkOut, checkIn)
            ),
        });
    },

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
        return await db.transaction(async (tx) => {
            // 0. Validate Unit and Get Price (Security: Don't trust frontend price)
            let unitPrice = 0;
            if (data.unitId) {
                const unit = await tx.query.stayUnits.findFirst({
                    where: eq(stayUnits.id, data.unitId),
                });
                if (!unit) throw new AppError('Unit not found', 404);
                if (unit.stayId !== data.stayId) throw new AppError('Unit does not belong to this stay', 400);

                unitPrice = unit.basePrice;
            } else {
                // Fallback for logic without unitId (e.g. legacy flats without units?)
                // Ideally every stay should have at least 1 unit.
                // Fetch stay base price
                const stay = await tx.query.stays.findFirst({
                    where: eq(stays.id, data.stayId!),
                });
                if (!stay) throw new AppError('Stay not found', 404);
                unitPrice = stay.basePrice;
            }

            // Calculate Total Amount
            const nights = Math.ceil((new Date(data.checkOut!).getTime() - new Date(data.checkIn!).getTime()) / (1000 * 60 * 60 * 24));
            if (nights < 1) throw new AppError('Invalid duration', 400);

            // Override totalAmount with calculated value
            data.totalAmount = unitPrice * nights;

            // 1. Concurrency Control: Advisory Lock based on Unit ID (or Stay ID if no unit)
            // This serialized access to this specific unit for the duration of the transaction.
            const lockId = data.unitId || data.stayId;
            await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${lockId}))`);

            // 2. Business Logic: Check for availability overlap within the locked context
            // If we have unitId, check unit availability.
            if (data.unitId) {
                const existing = await tx.query.bookings.findFirst({
                    where: and(
                        eq(bookings.unitId, data.unitId),
                        ne(bookings.status, 'cancelled'),
                        lt(bookings.checkIn, data.checkOut!),
                        gt(bookings.checkOut, data.checkIn!)
                    ),
                });

                if (existing) {
                    throw new AppError('The unit is already booked for the selected dates', 400);
                }
            }

            // 3. Generate booking number if not provided
            if (!data.bookingNumber) {
                data.bookingNumber = `BS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
            }

            const result = await tx.insert(bookings).values(data).returning();
            return result[0];
        });
    },

    async updateStatus(id: string, status: typeof bookings.status.enumValues[number]) {
        const result = await db
            .update(bookings)
            .set({ status })
            .where(eq(bookings.id, id))
            .returning();
        return result[0];
    },

    async getMyBookings(userId: string) {
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
                stayName: stays.name,
            })
            .from(bookings)
            .leftJoin(stays, eq(bookings.stayId, stays.id))
            .where(eq(bookings.customerId, userId))
            .orderBy(desc(bookings.createdAt));
    },
};

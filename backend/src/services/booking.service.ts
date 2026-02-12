import { db } from '@/db/index';
import { bookings, stays, stayUnits } from '@/db/schema/index';
import { eq, desc, and, lt, gt, ne, sql } from 'drizzle-orm';
import { AppError } from '@/utils/AppError';
import { RedisLockService } from './redis-lock.service';

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
                specialRequests: bookings.specialRequests,
                ownerId: bookings.ownerId,
                customerId: bookings.customerId,
            })
            .from(bookings)
            .leftJoin(stays, eq(bookings.stayId, stays.id))
            .where(eq(bookings.id, id));
        return result[0] || null;
    },

    async create(data: typeof bookings.$inferInsert) {
        // 1. Concurrency Control: Redis Lock (Strict Mutex)
        // We lock the *Unit* to ensure sequential availability checks.
        // TTL 10s is enough for the DB transaction.
        const lockKey = `booking_lock:${data.unitId || data.stayId}:${data.checkIn}:${data.checkOut}`;
        const lockToken = await RedisLockService.acquireLock(lockKey, 10000);

        if (!lockToken) {
            throw new AppError('Property is currently being booked by someone else. Please try again in a moment.', 409);
        }

        try {
            return await db.transaction(async (tx) => {
                // 2. Validate Unit and Get Price
                let unitPrice = 0;
                if (data.unitId) {
                    const unit = await tx.query.stayUnits.findFirst({
                        where: eq(stayUnits.id, data.unitId),
                    });
                    if (!unit) throw new AppError('Unit not found', 404);
                    if (unit.stayId !== data.stayId) throw new AppError('Unit does not belong to this stay', 400);

                    unitPrice = unit.basePrice;
                } else {
                    const stay = await tx.query.stays.findFirst({
                        where: eq(stays.id, data.stayId!),
                    });
                    if (!stay) throw new AppError('Stay not found', 404);
                    unitPrice = stay.basePrice;
                }

                // 3. Calculate Total Amount & Duration
                const checkInDate = new Date(data.checkIn!);
                const checkOutDate = new Date(data.checkOut!);
                const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

                if (nights < 1) throw new AppError('Invalid duration', 400);

                // Override totalAmount
                data.totalAmount = unitPrice * nights;

                // 4. Availability Check (Database Source of Truth)
                // Uses SELECT ... FOR UPDATE to lock matching rows and prevent
                // concurrent bookings from passing the overlap check simultaneously.
                if (data.unitId) {
                    const overlapping = await tx.execute(sql`
                        SELECT id FROM bookings
                        WHERE unit_id = ${data.unitId}
                          AND status IN ('reserved', 'confirmed', 'checked_in', 'completed')
                          AND check_in < ${data.checkOut}
                          AND check_out > ${data.checkIn}
                        FOR UPDATE
                        LIMIT 1
                    `);

                    if (overlapping.length > 0) {
                        throw new AppError('The unit is already booked for the selected dates', 409);
                    }
                }

                // 5. Generate Booking Number (DB sequence for guaranteed uniqueness)
                if (!data.bookingNumber) {
                    const [{ seq }] = await tx.execute(sql`
                        SELECT nextval(pg_get_serial_sequence('bookings', 'id'))::text AS seq
                    `) as any;
                    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                    data.bookingNumber = `STY-${datePart}-${String(seq).slice(-6).padStart(6, '0')}`;
                }

                // 6. Set Defaults for "Pay Later" / "Pay Now" Flow
                // Requirement: Booking = RESERVED, Payment = NOT_REQUIRED (initially) or PENDING
                data.status = 'reserved';
                data.paymentStatus = 'pending'; // Default to pending expectation

                // Requirement: Auto-expires after X hours (e.g., 1 hour for payment)
                const expiryTime = new Date();
                expiryTime.setHours(expiryTime.getHours() + 1);
                data.expiresAt = expiryTime;

                const result = await tx.insert(bookings).values(data).returning();
                return result[0];
            });
        } finally {
            // 7. Always release the lock
            await RedisLockService.releaseLock(lockKey, lockToken);
        }
    },

    async transitionStatus(
        id: string,
        targetStatus: typeof bookings.status.enumValues[number],
        options?: { cancelledBy?: string; cancellationReason?: string }
    ) {
        return await db.transaction(async (tx) => {
            const booking = await tx.query.bookings.findFirst({
                where: eq(bookings.id, id),
            });

            if (!booking) throw new AppError('Booking not found', 404);

            const currentStatus = booking.status;

            // State Machine Validation
            const validTransitions: Record<string, string[]> = {
                'initiated': ['reserved', 'cancelled'],
                'reserved': ['confirmed', 'cancelled', 'expired'],
                'confirmed': ['completed', 'cancelled', 'checked_in'],
                'checked_in': ['completed', 'cancelled'],
                'completed': [],
                'cancelled': [],
                'expired': [],
            };

            const allowed = validTransitions[currentStatus] || [];
            if (!allowed.includes(targetStatus)) {
                throw new AppError(`Invalid status transition from ${currentStatus} to ${targetStatus}`, 400);
            }

            // Build update payload
            const updateFields: Record<string, unknown> = {
                status: targetStatus,
                updatedAt: new Date(),
            };

            if (targetStatus === 'confirmed') {
                updateFields.confirmedAt = new Date();
            }

            // Cancellation-specific side effects
            if (targetStatus === 'cancelled') {
                updateFields.cancelledAt = new Date();
                updateFields.cancelledBy = (options?.cancelledBy as any) || 'system';
                updateFields.cancellationReason = options?.cancellationReason || null;

                // If payment was already completed, flag for refund
                if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'success') {
                    updateFields.paymentStatus = 'refunded';
                    // TODO: Trigger actual gateway refund via PaymentService
                }
            }

            const result = await tx
                .update(bookings)
                .set(updateFields as any)
                .where(eq(bookings.id, id))
                .returning();

            return result[0];
        });
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

    async getBookingsByOwner(ownerId: string) {
        // Query denormalized ownerId if available, or join stays (safer)
        // Schema has ownerId on bookings (denormalized). perfect.
        return await db
            .select({
                id: bookings.id,
                guestName: bookings.guestName,
                // ... other fields
                checkIn: bookings.checkIn,
                checkOut: bookings.checkOut,
                status: bookings.status,
                totalAmount: bookings.totalAmount,
                createdAt: bookings.createdAt,
                stayName: stays.name,
            })
            .from(bookings)
            .leftJoin(stays, eq(bookings.stayId, stays.id))
            .where(eq(bookings.ownerId, ownerId))
            .orderBy(desc(bookings.createdAt));
    },
};

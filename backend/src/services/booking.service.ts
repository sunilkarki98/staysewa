import { db } from '@/db/index';
import { bookings, properties, propertyUnits } from '@/db/schema/index';
import { eq, desc, and, lt, gt, ne, sql } from 'drizzle-orm';
import { AppError } from '@/utils/AppError';
import { RedisLockService } from './redis-lock.service';

export const BookingsService = {
    /**
     * Check if a unit is already booked for a given date range
     */
    async findOverlap(unit_id: string, check_in: string, check_out: string) {
        return await db.query.bookings.findFirst({
            where: and(
                eq(bookings.unit_id, unit_id),
                ne(bookings.status, 'cancelled'),
                lt(bookings.check_in, check_out),
                gt(bookings.check_out, check_in)
            ),
        });
    },

    async getAll() {
        return await db
            .select({
                id: bookings.id,
                guest_name: bookings.guest_name,
                guest_email: bookings.guest_email,
                guest_phone: bookings.guest_phone,
                check_in: bookings.check_in,
                check_out: bookings.check_out,
                status: bookings.status,
                total_amount: bookings.total_amount,
                created_at: bookings.created_at,
                property_id: bookings.property_id,
                property_name: properties.name,
            })
            .from(bookings)
            .leftJoin(properties, eq(bookings.property_id, properties.id))
            .orderBy(desc(bookings.created_at));
    },

    async getById(id: string) {
        const result = await db
            .select({
                id: bookings.id,
                guest_name: bookings.guest_name,
                guest_email: bookings.guest_email,
                guest_phone: bookings.guest_phone,
                check_in: bookings.check_in,
                check_out: bookings.check_out,
                status: bookings.status,
                total_amount: bookings.total_amount,
                created_at: bookings.created_at,
                property_name: properties.name,
                special_requests: bookings.special_requests,
                owner_id: bookings.owner_id,
                customer_id: bookings.customer_id,
            })
            .from(bookings)
            .leftJoin(properties, eq(bookings.property_id, properties.id))
            .where(eq(bookings.id, id));
        return result[0] || null;
    },

    async create(data: typeof bookings.$inferInsert) {
        // 1. Concurrency Control: Redis Lock
        const lockKey = `booking_lock:${data.unit_id || data.property_id}:${data.check_in}:${data.check_out}`;
        const lockToken = await RedisLockService.acquireLock(lockKey, 10000);

        if (!lockToken) {
            throw new AppError('Property is currently being booked by someone else. Please try again in a moment.', 409);
        }

        try {
            return await db.transaction(async (tx) => {
                // 2. Validate Unit and Get Price
                let unitPrice = 0;
                if (data.unit_id) {
                    const unit = await tx.query.propertyUnits.findFirst({
                        where: eq(propertyUnits.id, data.unit_id),
                    });
                    if (!unit) throw new AppError('Unit not found', 404);
                    if (unit.property_id !== data.property_id) throw new AppError('Unit does not belong to this property', 400);

                    unitPrice = unit.base_price;
                } else {
                    const property = await tx.query.properties.findFirst({
                        where: eq(properties.id, data.property_id!),
                    });
                    if (!property) throw new AppError('Property not found', 404);
                    unitPrice = property.base_price;
                }

                // 3. Calculate Total Amount & Duration
                const checkInDate = new Date(data.check_in!);
                const checkOutDate = new Date(data.check_out!);
                const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

                if (nights < 1) throw new AppError('Invalid duration', 400);

                // Override total_amount
                data.total_amount = unitPrice * nights;

                // 4. Availability Check
                if (data.unit_id) {
                    const overlapping = await tx.execute(sql`
                        SELECT id FROM bookings
                        WHERE unit_id = ${data.unit_id}
                          AND status IN ('reserved', 'confirmed', 'checked_in', 'completed')
                          AND check_in < ${data.check_out}
                          AND check_out > ${data.check_in}
                        FOR UPDATE
                        LIMIT 1
                    `);

                    if (overlapping.length > 0) {
                        throw new AppError('The unit is already booked for the selected dates', 409);
                    }
                }

                // 5. Generate Booking Number
                if (!data.booking_number) {
                    // Note: In a fresh DB, we might need a custom sequence or just use UUID for now 
                    // if the sequence based on 'id' SERIAL doesn't exist because we use UUID.
                    // But we'll try to keep the logic or use a simpler one.
                    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
                    data.booking_number = `BK-${datePart}-${randomPart}`;
                }

                // 6. Set Defaults
                data.status = 'reserved';
                data.payment_status = 'pending';

                const expiryTime = new Date();
                expiryTime.setHours(expiryTime.getHours() + 1);
                data.expires_at = expiryTime;

                const result = await tx.insert(bookings).values(data).returning();
                return result[0];
            });
        } finally {
            await RedisLockService.releaseLock(lockKey, lockToken);
        }
    },

    async transitionStatus(
        id: string,
        targetStatus: typeof bookings.status.enumValues[number],
        options?: { cancelled_by?: string; cancellation_reason?: string }
    ) {
        return await db.transaction(async (tx) => {
            const booking = await tx.query.bookings.findFirst({
                where: eq(bookings.id, id),
            });

            if (!booking) throw new AppError('Booking not found', 404);

            const currentStatus = booking.status;

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

            const updateFields: any = {
                status: targetStatus,
                updated_at: new Date(),
            };

            if (targetStatus === 'confirmed') {
                updateFields.confirmed_at = new Date();
            }

            if (targetStatus === 'cancelled') {
                updateFields.cancelled_at = new Date();
                updateFields.cancelled_by = options?.cancelled_by || 'system';
                updateFields.cancellation_reason = options?.cancellation_reason || null;

                if (booking.payment_status === 'paid' || booking.payment_status === 'success') {
                    updateFields.payment_status = 'refunded';
                }
            }

            const result = await tx
                .update(bookings)
                .set(updateFields)
                .where(eq(bookings.id, id))
                .returning();

            return result[0];
        });
    },

    async getMyBookings(userId: string) {
        return await db
            .select({
                id: bookings.id,
                guest_name: bookings.guest_name,
                guest_email: bookings.guest_email,
                guest_phone: bookings.guest_phone,
                check_in: bookings.check_in,
                check_out: bookings.check_out,
                status: bookings.status,
                total_amount: bookings.total_amount,
                created_at: bookings.created_at,
                property_id: bookings.property_id,
                property_name: properties.name,
            })
            .from(bookings)
            .leftJoin(properties, eq(bookings.property_id, properties.id))
            .where(eq(bookings.customer_id, userId))
            .orderBy(desc(bookings.created_at));
    },

    async getBookingsByOwner(ownerId: string) {
        return await db
            .select({
                id: bookings.id,
                guest_name: bookings.guest_name,
                check_in: bookings.check_in,
                check_out: bookings.check_out,
                status: bookings.status,
                total_amount: bookings.total_amount,
                created_at: bookings.created_at,
                property_id: bookings.property_id,
                property_name: properties.name,
            })
            .from(bookings)
            .leftJoin(properties, eq(bookings.property_id, properties.id))
            .where(eq(bookings.owner_id, ownerId))
            .orderBy(desc(bookings.created_at));
    },
};

import { db } from '@/db';
import { bookings } from '@/db/schema';
import { and, eq, lt, sql } from 'drizzle-orm';
import { logger } from '@/utils/logger';

export const runBookingExpiryJob = async () => {
    try {
        const now = new Date();

        // Find bookings that are RESERVED and have passed their expiry time
        const expiredBookings = await db
            .update(bookings)
            .set({
                status: 'expired',
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(bookings.status, 'reserved'),
                    lt(bookings.expiresAt, now)
                )
            )
            .returning({ id: bookings.id });

        if (expiredBookings.length > 0) {
            logger.info(`[Cron] Expired ${expiredBookings.length} stale bookings.`);
        }
    } catch (error) {
        logger.error(error, '[Cron] Failed to run booking expiry job');
    }
};

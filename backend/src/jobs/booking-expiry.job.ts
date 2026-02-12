import { db } from '@/db';
import { bookings } from '@/db/schema';
import { and, eq, lt } from 'drizzle-orm';
import { logger } from '@/utils/logger';

export const runBookingExpiryJob = async () => {
    try {
        const now = new Date();

        // Find bookings that are RESERVED and have passed their expiry time
        const expiredBookings = await db
            .update(bookings)
            .set({
                status: 'expired',
                updated_at: now
            })
            .where(
                and(
                    eq(bookings.status, 'reserved'),
                    lt(bookings.expires_at, now)
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

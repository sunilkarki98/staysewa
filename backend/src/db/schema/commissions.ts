import { pgTable, uuid, integer, timestamp, text, index } from 'drizzle-orm/pg-core';
import { bookings } from '@/db/schema/bookings';

/**
 * Commissions Table - Tracks platform revenue and owner payouts
 */
export const commissions = pgTable('commissions', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id').references(() => bookings.id).notNull().unique(),

    // Percentages at time of booking (insurance against future fee changes)
    serviceFeePercent: integer('service_fee_percent').notNull(),

    // Calculated amounts (in Paisa)
    totalBookingAmount: integer('total_booking_amount').notNull(),
    platformFee: integer('platform_fee').notNull(),
    taxAmount: integer('tax_amount').default(0),
    ownerNetPayout: integer('owner_net_payout').notNull(),

    status: text('payout_status').default('pending'), // pending, processed, paid, failed
    payoutDate: timestamp('payout_date', { withTimezone: true }),

    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    bookingIdIdx: index('commission_booking_id_idx').on(table.bookingId),
    statusIdx: index('commission_status_idx').on(table.status),
}));

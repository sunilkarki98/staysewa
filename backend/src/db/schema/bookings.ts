import { pgTable, text, uuid, timestamp, boolean, integer, jsonb, date, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { stays, stayUnits } from '@/db/schema/stays';
import { bookingStatusEnum, paymentStatusEnum, paymentMethodEnum, paymentTxnStatusEnum, cancelledByEnum } from '@/db/schema/enums';

// ─── Bookings ───────────────────────────────────────────────
export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingNumber: text('booking_number').notNull().unique(), // STY-20231001-A1B2
    stayId: uuid('stay_id').references(() => stays.id).notNull(),
    unitId: uuid('unit_id').references(() => stayUnits.id).notNull(),
    customerId: uuid('customer_id').references(() => users.id).notNull(),
    ownerId: uuid('owner_id').references(() => users.id).notNull(), // Denormalized for query speed

    checkIn: date('check_in', { mode: 'string' }).notNull(),
    checkOut: date('check_out', { mode: 'string' }).notNull(),
    nights: integer('nights').notNull(),
    guestsCount: integer('guests_count').default(1).notNull(),

    // Guest Snapshot
    guestName: text('guest_name').notNull(),
    guestEmail: text('guest_email'),
    guestPhone: text('guest_phone'),

    // Financials (in Paisa)
    baseAmount: integer('base_amount').notNull(),
    taxes: integer('taxes').default(0),
    serviceFee: integer('service_fee').default(0),
    discount: integer('discount').default(0),
    totalAmount: integer('total_amount').notNull(),
    currency: text('currency').default('NPR'),

    // Status
    status: bookingStatusEnum('status').default('initiated').notNull(),
    paymentStatus: paymentStatusEnum('payment_status').default('not_required').notNull(),

    // Lifecycle
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    metadata: jsonb('metadata'), // General metadata including payment trails

    specialRequests: text('special_requests'),
    cancellationReason: text('cancellation_reason'),
    cancelledBy: cancelledByEnum('cancelled_by'),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    stayIdIdx: index('booking_stay_id_idx').on(table.stayId),
    customerIdIdx: index('booking_customer_id_idx').on(table.customerId),
    ownerIdIdx: index('booking_owner_id_idx').on(table.ownerId),
    // M1: Composite index for overlap queries (C1 performance)
    overlapIdx: index('booking_overlap_idx').on(table.unitId, table.status, table.checkIn, table.checkOut),
    // M1: Index for expiration job (H2)
    expiryIdx: index('booking_status_expiry_idx').on(table.status, table.expiresAt),
    // CHECK constraints to prevent invalid financial data
    totalPositive: check('total_amount_positive', sql`${table.totalAmount} > 0`),
    nightsPositive: check('nights_positive', sql`${table.nights} >= 1`),
    dateOrder: check('date_order_check', sql`${table.checkOut} > ${table.checkIn}`),
    taxesNonNeg: check('taxes_non_negative', sql`${table.taxes} >= 0`),
    feeNonNeg: check('service_fee_non_negative', sql`${table.serviceFee} >= 0`),
    discountNonNeg: check('discount_non_negative', sql`${table.discount} >= 0`),
}));

// ─── Payments ───────────────────────────────────────────────
export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id').references(() => bookings.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(), // Who paid
    amount: integer('amount').notNull(),
    currency: text('currency').default('NPR'),
    method: paymentMethodEnum('method').notNull(),
    gatewayTxnId: text('gateway_txn_id'), // Khalti/eSewa ID
    gatewayResponse: jsonb('gateway_response'),
    status: paymentTxnStatusEnum('status').default('initiated').notNull(),
    refundAmount: integer('refund_amount').default(0),
    refundReason: text('refund_reason'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    bookingIdIdx: index('payment_booking_id_idx').on(table.bookingId),
    gatewayTxnIdx: index('payment_gateway_txn_idx').on(table.gatewayTxnId),
}));



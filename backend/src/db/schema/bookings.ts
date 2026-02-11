import { pgTable, text, uuid, timestamp, boolean, integer, jsonb, date } from 'drizzle-orm/pg-core';
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
});

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
});

// ─── Reviews ────────────────────────────────────────────────
export const reviews = pgTable('reviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id').references(() => bookings.id).unique().notNull(),
    stayId: uuid('stay_id').references(() => stays.id).notNull(),
    reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
    rating: integer('rating').notNull(), // 1-5
    cleanliness: integer('cleanliness'),
    location: integer('location'),
    value: integer('value'),
    communication: integer('communication'),
    comment: text('comment'),
    ownerReply: text('owner_reply'),
    ownerRepliedAt: timestamp('owner_replied_at', { withTimezone: true }),
    isVisible: boolean('is_visible').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

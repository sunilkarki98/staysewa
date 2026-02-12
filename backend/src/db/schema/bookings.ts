import { pgTable, text, uuid, timestamp, integer, numeric, jsonb, date, index, uniqueIndex, check, boolean } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { properties, propertyUnits, cancellationPolicies } from '@/db/schema/properties';
import { reviews } from '@/db/schema/reviews';
import { disputes } from '@/db/schema/support';

/* ───── BOOKINGS ───── */
export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    booking_number: text('booking_number').notNull().unique(),

    // Relations
    property_id: uuid('property_id').references(() => properties.id).notNull(),
    unit_id: uuid('unit_id').references(() => propertyUnits.id).notNull(),
    customer_id: uuid('customer_id').references(() => users.id).notNull(),
    owner_id: uuid('owner_id').references(() => users.id).notNull(),

    // Dates
    check_in: date('check_in', { mode: 'string' }).notNull(),
    check_out: date('check_out', { mode: 'string' }).notNull(),
    nights: integer('nights').notNull(),
    guests_count: integer('guests_count').default(1).notNull(),

    // Guest snapshot (point-in-time data)
    guest_name: text('guest_name').notNull(),
    guest_email: text('guest_email'),
    guest_phone: text('guest_phone'),
    snapshot_of_user_id: uuid('snapshot_of_user_id').references(() => users.id),

    // Property snapshot (for display without joins)
    property_name: text('property_name').notNull(),
    property_address: text('property_address'),
    unit_name: text('unit_name').notNull(),

    // Pricing
    base_amount: integer('base_amount').notNull(),
    taxes: integer('taxes').default(0),
    service_fee: integer('service_fee').default(0),
    discount: integer('discount').default(0),
    total_amount: integer('total_amount').notNull(),
    currency: text('currency').default('NPR'),

    // Commission
    commission_amount: integer('commission_amount').default(0),
    commission_rate: numeric('commission_rate', { precision: 4, scale: 2 }),

    // Owner payout
    payout_amount: integer('payout_amount').default(0), // total - commission - platform fees

    // Status
    status: text('status').default('initiated').notNull(),
    payment_status: text('payment_status').default('pending').notNull(),

    // Timings
    expires_at: timestamp('expires_at', { withTimezone: true }),
    confirmed_at: timestamp('confirmed_at', { withTimezone: true }),
    cancelled_at: timestamp('cancelled_at', { withTimezone: true }),
    completed_at: timestamp('completed_at', { withTimezone: true }),

    // Cancellation
    cancellation_policy_id: uuid('cancellation_policy_id').references(() => cancellationPolicies.id),
    cancellation_reason: text('cancellation_reason'),
    cancelled_by: uuid('cancelled_by').references(() => users.id),
    refund_amount: integer('refund_amount').default(0),

    // Additional
    special_requests: text('special_requests'),
    metadata: jsonb('metadata'),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    property_idx: index('booking_property_idx').on(table.property_id),
    unit_idx: index('booking_unit_idx').on(table.unit_id),
    customer_idx: index('booking_customer_idx').on(table.customer_id),
    owner_idx: index('booking_owner_idx').on(table.owner_id),
    status_idx: index('booking_status_idx').on(table.status),
    dates_idx: index('booking_dates_idx').on(table.check_in, table.check_out),
    expiry_idx: index('booking_expiry_idx').on(table.status, table.expires_at),
    total_positive: check('total_positive', sql`${table.total_amount} > 0`),
    nights_positive: check('nights_positive', sql`${table.nights} >= 1`),
    date_order: check('date_order', sql`${table.check_out} > ${table.check_in}`)
}));

/* ───── PAYMENTS ───── */
export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    booking_id: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }).notNull(),
    user_id: uuid('user_id').references(() => users.id).notNull(),

    amount: integer('amount').notNull(),
    currency: text('currency').default('NPR'),
    method: text('method').notNull(),

    // Gateway details
    transaction_id: text('transaction_id'),
    gateway_reference: text('gateway_reference'),
    gateway_response: jsonb('gateway_response'),

    status: text('status').default('pending').notNull(),

    // Timestamps
    processed_at: timestamp('processed_at', { withTimezone: true }),
    failed_at: timestamp('failed_at', { withTimezone: true }),
    refunded_at: timestamp('refunded_at', { withTimezone: true }),

    error_message: text('error_message'),
    metadata: jsonb('metadata'),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    booking_idx: index('payments_booking_idx').on(table.booking_id),
    user_idx: index('payments_user_idx').on(table.user_id),
    status_idx: index('payments_status_idx').on(table.status),
    transaction_idx: index('payments_transaction_idx').on(table.transaction_id),
    amount_positive: check('amount_positive', sql`${table.amount} > 0`)
}));

/* ───── PAYOUTS (Owner payments) ───── */
export const payouts = pgTable('payouts', {
    id: uuid('id').defaultRandom().primaryKey(),
    owner_id: uuid('owner_id').references(() => users.id).notNull(),

    amount: integer('amount').notNull(),
    currency: text('currency').default('NPR'),

    // Bank details
    bank_name: text('bank_name'),
    account_number: text('account_number'),
    account_holder: text('account_holder'),

    // Payment method for payout
    method: text('method'), // bank_transfer, mobile_wallet
    reference_number: text('reference_number'),

    status: text('status').default('pending').notNull(),

    // Related bookings
    booking_ids: jsonb('booking_ids'), // Array of booking IDs included in this payout

    processed_at: timestamp('processed_at', { withTimezone: true }),
    failed_at: timestamp('failed_at', { withTimezone: true }),

    notes: text('notes'),
    error_message: text('error_message'),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    owner_idx: index('payouts_owner_idx').on(table.owner_id),
    status_idx: index('payouts_status_idx').on(table.status),
    amount_positive: check('amount_positive', sql`${table.amount} > 0`)
}));

/* ───── PRICE RULES ───── */
export const priceRules = pgTable('price_rules', {
    id: uuid('id').defaultRandom().primaryKey(),
    property_id: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
    unit_id: uuid('unit_id').references(() => propertyUnits.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: text('type').notNull(),

    // Date range
    start_date: date('start_date', { mode: 'string' }),
    end_date: date('end_date', { mode: 'string' }),

    // Days of week (for weekend pricing)
    days_of_week: jsonb('days_of_week'), // [0,6] for weekend

    // Adjustment
    adjustment_type: text('adjustment_type').notNull(),
    adjustment_value: integer('adjustment_value').notNull(),

    min_nights: integer('min_nights'),
    priority: integer('priority').default(0),
    is_active: boolean('is_active').default(true),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    property_idx: index('price_rules_property_idx').on(table.property_id),
    unit_idx: index('price_rules_unit_idx').on(table.unit_id),
    date_idx: index('price_rules_date_idx').on(table.start_date, table.end_date),
    active_idx: index('price_rules_active_idx').on(table.is_active)
}));

/* ───── RELATIONS ───── */
export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    property: one(properties, { fields: [bookings.property_id], references: [properties.id] }),
    unit: one(propertyUnits, { fields: [bookings.unit_id], references: [propertyUnits.id] }),
    customer: one(users, { fields: [bookings.customer_id], references: [users.id], relationName: 'customer' }),
    owner: one(users, { fields: [bookings.owner_id], references: [users.id], relationName: 'owner' }),
    payments: many(payments),
    review: one(reviews),
    dispute: one(disputes),
    cancellationPolicy: one(cancellationPolicies, { fields: [bookings.cancellation_policy_id], references: [cancellationPolicies.id] })
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    booking: one(bookings, { fields: [payments.booking_id], references: [bookings.id] }),
    user: one(users, { fields: [payments.user_id], references: [users.id] })
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
    owner: one(users, { fields: [payouts.owner_id], references: [users.id] })
}));

export const priceRulesRelations = relations(priceRules, ({ one }) => ({
    property: one(properties, { fields: [priceRules.property_id], references: [properties.id] }),
    unit: one(propertyUnits, { fields: [priceRules.unit_id], references: [propertyUnits.id] })
}));

import { pgTable, text, uuid, timestamp, integer, boolean, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { bookings } from '@/db/schema/bookings';

/* ───── COUPONS / DISCOUNTS ───── */
export const coupons = pgTable('coupons', {
    id: uuid('id').defaultRandom().primaryKey(),
    code: text('code').notNull().unique(),
    description: text('description'),

    discount_type: text('discount_type').notNull(), // percentage, fixed
    discount_value: integer('discount_value').notNull(),

    min_booking_amount: integer('min_booking_amount'),
    max_discount: integer('max_discount'),

    valid_from: timestamp('valid_from', { withTimezone: true }),
    valid_until: timestamp('valid_until', { withTimezone: true }),

    usage_limit: integer('usage_limit'),
    usage_count: integer('usage_count').default(0),

    user_limit: integer('user_limit').default(1), // Per user usage limit

    applicable_properties: jsonb('applicable_properties'), // Array of property IDs, null = all

    is_active: boolean('is_active').default(true),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    code_idx: index('coupons_code_idx').on(table.code),
    active_idx: index('coupons_active_idx').on(table.is_active)
}));

export const couponUsage = pgTable('coupon_usage', {
    id: uuid('id').defaultRandom().primaryKey(),
    coupon_id: uuid('coupon_id').references(() => coupons.id, { onDelete: 'cascade' }).notNull(),
    booking_id: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }).notNull(),
    user_id: uuid('user_id').references(() => users.id).notNull(),
    discount_amount: integer('discount_amount').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    coupon_idx: index('coupon_usage_coupon_idx').on(table.coupon_id),
    user_idx: index('coupon_usage_user_idx').on(table.user_id),
    booking_unique: uniqueIndex('coupon_usage_booking').on(table.booking_id)
}));

/* ───── RELATIONS ───── */
export const couponsRelations = relations(coupons, ({ many }) => ({
    usage: many(couponUsage)
}));

export const couponUsageRelations = relations(couponUsage, ({ one }) => ({
    coupon: one(coupons, { fields: [couponUsage.coupon_id], references: [coupons.id] }),
    booking: one(bookings, { fields: [couponUsage.booking_id], references: [bookings.id] }),
    user: one(users, { fields: [couponUsage.user_id], references: [users.id] })
}));

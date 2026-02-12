import { pgTable, text, timestamp, uuid, integer, check, index } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { users } from './users';
import { stays } from './stays';
import { bookings } from './bookings';

export const reviews = pgTable('reviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id').references(() => bookings.id).unique().notNull(),
    stayId: uuid('stay_id').references(() => stays.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
    stayIdIdx: index('review_stay_id_idx').on(table.stayId),
    userIdIdx: index('review_user_id_idx').on(table.userId),
}));

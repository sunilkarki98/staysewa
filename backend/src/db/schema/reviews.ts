import { pgTable, text, uuid, timestamp, integer, boolean, jsonb, index, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { properties } from '@/db/schema/properties';
import { bookings } from '@/db/schema/bookings';

/* ───── REVIEWS ───── */
export const reviews = pgTable('reviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    booking_id: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }).notNull().unique(),
    property_id: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
    reviewer_id: uuid('reviewer_id').references(() => users.id).notNull(),

    // Ratings (1-5)
    overall_rating: integer('overall_rating').notNull(),
    cleanliness_rating: integer('cleanliness_rating'),
    accuracy_rating: integer('accuracy_rating'),
    communication_rating: integer('communication_rating'),
    location_rating: integer('location_rating'),
    value_rating: integer('value_rating'),

    // Review content
    title: text('title'),
    comment: text('comment'),

    // Photos
    photos: jsonb('photos').default([]),

    // Owner response
    owner_response: text('owner_response'),
    owner_responded_at: timestamp('owner_responded_at', { withTimezone: true }),

    // Moderation
    status: text('status').default('pending').notNull(),
    is_verified_stay: boolean('is_verified_stay').default(true),
    flagged: boolean('flagged').default(false),
    flagged_reason: text('flagged_reason'),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    property_idx: index('reviews_property_idx').on(table.property_id),
    reviewer_idx: index('reviews_reviewer_idx').on(table.reviewer_id),
    status_idx: index('reviews_status_idx').on(table.status),
    rating_check: check('rating_check', sql`${table.overall_rating} >= 1 AND ${table.overall_rating} <= 5`)
}));

/* ───── RELATIONS ───── */
export const reviewsRelations = relations(reviews, ({ one }) => ({
    booking: one(bookings, { fields: [reviews.booking_id], references: [bookings.id] }),
    property: one(properties, { fields: [reviews.property_id], references: [properties.id] }),
    reviewer: one(users, { fields: [reviews.reviewer_id], references: [users.id] })
}));

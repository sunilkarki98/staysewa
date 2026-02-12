import { pgTable, text, uuid, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { bookings } from '@/db/schema/bookings';

/* ───── DISPUTES ───── */
export const disputes = pgTable('disputes', {
    id: uuid('id').defaultRandom().primaryKey(),
    booking_id: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }).notNull(),
    raised_by: uuid('raised_by').references(() => users.id).notNull(),
    against: uuid('against').references(() => users.id).notNull(),

    subject: text('subject').notNull(),
    description: text('description').notNull(),
    category: text('category'), // payment, property_condition, cancellation, other

    evidence: jsonb('evidence').default([]), // URLs to photos/documents

    status: text('status').default('open').notNull(),

    assigned_to: uuid('assigned_to').references(() => users.id), // Admin handling the dispute
    resolution: text('resolution'),
    resolved_at: timestamp('resolved_at', { withTimezone: true }),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    booking_idx: index('disputes_booking_idx').on(table.booking_id),
    raised_by_idx: index('disputes_raised_by_idx').on(table.raised_by),
    status_idx: index('disputes_status_idx').on(table.status)
}));

/* ───── RELATIONS ───── */
export const disputesRelations = relations(disputes, ({ one }) => ({
    booking: one(bookings, { fields: [disputes.booking_id], references: [bookings.id] }),
    raisedBy: one(users, { fields: [disputes.raised_by], references: [users.id] }),
    against: one(users, { fields: [disputes.against], references: [users.id] }),
    assignedTo: one(users, { fields: [disputes.assigned_to], references: [users.id] })
}));

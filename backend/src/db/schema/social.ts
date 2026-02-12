import { pgTable, text, uuid, timestamp, boolean, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { properties } from '@/db/schema/properties';
import { bookings } from '@/db/schema/bookings';

/* ───── FAVORITES / WISHLISTS ───── */
export const favorites = pgTable('favorites', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    property_id: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    user_property_unique: uniqueIndex('favorites_user_property').on(table.user_id, table.property_id),
    user_idx: index('favorites_user_idx').on(table.user_id)
}));

/* ───── NOTIFICATIONS ───── */
export const notifications = pgTable('notifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    type: text('type').notNull(), // booking_confirmed, payment_received, review_received, etc.
    title: text('title').notNull(),
    message: text('message').notNull(),

    action_url: text('action_url'),
    metadata: jsonb('metadata'),

    is_read: boolean('is_read').default(false),
    read_at: timestamp('read_at', { withTimezone: true }),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    user_idx: index('notifications_user_idx').on(table.user_id),
    unread_idx: index('notifications_unread_idx').on(table.user_id, table.is_read),
    created_idx: index('notifications_created_idx').on(table.created_at)
}));

/* ───── MESSAGES (Guest-Owner communication) ───── */
export const conversations = pgTable('conversations', {
    id: uuid('id').defaultRandom().primaryKey(),
    property_id: uuid('property_id').references(() => properties.id).notNull(),
    booking_id: uuid('booking_id').references(() => bookings.id),

    participant_1: uuid('participant_1').references(() => users.id).notNull(),
    participant_2: uuid('participant_2').references(() => users.id).notNull(),

    last_message_at: timestamp('last_message_at', { withTimezone: true }),
    last_message_preview: text('last_message_preview'),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    participants_unique: uniqueIndex('conv_participants').on(table.participant_1, table.participant_2, table.property_id),
    participant1_idx: index('conv_participant1_idx').on(table.participant_1),
    participant2_idx: index('conv_participant2_idx').on(table.participant_2)
}));

export const messages = pgTable('messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    conversation_id: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
    sender_id: uuid('sender_id').references(() => users.id).notNull(),

    message: text('message').notNull(),
    attachments: jsonb('attachments').default([]),

    is_read: boolean('is_read').default(false),
    read_at: timestamp('read_at', { withTimezone: true }),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    conversation_idx: index('messages_conversation_idx').on(table.conversation_id),
    sender_idx: index('messages_sender_idx').on(table.sender_id),
    created_idx: index('messages_created_idx').on(table.created_at)
}));

/* ───── RELATIONS ───── */
export const favoritesRelations = relations(favorites, ({ one }) => ({
    user: one(users, { fields: [favorites.user_id], references: [users.id] }),
    property: one(properties, { fields: [favorites.property_id], references: [properties.id] })
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, { fields: [notifications.user_id], references: [users.id] })
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
    property: one(properties, { fields: [conversations.property_id], references: [properties.id] }),
    booking: one(bookings, { fields: [conversations.booking_id], references: [bookings.id] }),
    participant1: one(users, { fields: [conversations.participant_1], references: [users.id] }),
    participant2: one(users, { fields: [conversations.participant_2], references: [users.id] }),
    messages: many(messages)
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, { fields: [messages.conversation_id], references: [conversations.id] }),
    sender: one(users, { fields: [messages.sender_id], references: [users.id] })
}));

import { pgTable, text, uuid, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users';
import { bookings } from '@/db/schema/bookings';
import { notificationChannelEnum, ticketCategoryEnum, ticketPriorityEnum, ticketStatusEnum } from '@/db/schema/enums';

// ─── Messages (Owner ↔ Customer) ────────────────────────────
export const messages = pgTable('messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id').notNull(), // Groups messages
    senderId: uuid('sender_id').references(() => users.id).notNull(),
    receiverId: uuid('receiver_id').references(() => users.id).notNull(),
    bookingId: uuid('booking_id').references(() => bookings.id), // Context
    content: text('content').notNull(),
    isRead: boolean('is_read').default(false),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Notifications ──────────────────────────────────────────
export const notifications = pgTable('notifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    type: text('type').notNull(), // booking_confirmed, payment_received
    title: text('title').notNull(),
    body: text('body'),
    data: jsonb('data').default({}), // Deep-link metadata
    channel: notificationChannelEnum('channel').default('in_app'),
    isRead: boolean('is_read').default(false),
    readAt: timestamp('read_at', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow(),
});

// ─── Support Tickets ────────────────────────────────────────
export const supportTickets = pgTable('support_tickets', {
    id: uuid('id').defaultRandom().primaryKey(),
    ticketNumber: text('ticket_number').notNull().unique(), // SUP-20231001-001
    userId: uuid('user_id').references(() => users.id).notNull(),
    bookingId: uuid('booking_id').references(() => bookings.id),
    category: ticketCategoryEnum('category').notNull(),
    subject: text('subject').notNull(),
    priority: ticketPriorityEnum('priority').default('medium'),
    status: ticketStatusEnum('status').default('open'),
    assignedTo: uuid('assigned_to').references(() => users.id), // Admin
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Support Messages ───────────────────────────────────────
export const supportMessages = pgTable('support_messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    ticketId: uuid('ticket_id').references(() => supportTickets.id).notNull(),
    senderId: uuid('sender_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    attachments: jsonb('attachments').default([]),
    isInternal: boolean('is_internal').default(false), // Admin-only notes
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

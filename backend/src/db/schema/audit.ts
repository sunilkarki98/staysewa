import { pgTable, text, uuid, timestamp, jsonb, inet } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users';

// ─── Audit Logs ─────────────────────────────────────────────
export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id), // Nullable for system events
    action: text('action').notNull(), // booking.created, payment.completed
    entityType: text('entity_type').notNull(), // booking, stay, user
    entityId: uuid('entity_id').notNull(),
    oldValues: jsonb('old_values'),
    newValues: jsonb('new_values'),
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

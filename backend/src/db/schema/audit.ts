import { pgTable, text, uuid, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users';

/* ───── AUDIT LOGS ───── */
export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id),

    entity_type: text('entity_type').notNull(), // booking, payment, user, property
    entity_id: uuid('entity_id').notNull(),

    action: text('action').notNull(), // created, updated, deleted, status_changed

    old_values: jsonb('old_values'),
    new_values: jsonb('new_values'),

    ip_address: text('ip_address'),
    user_agent: text('user_agent'),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    entity_idx: index('audit_entity_idx').on(table.entity_type, table.entity_id),
    user_idx: index('audit_user_idx').on(table.user_id),
    created_idx: index('audit_created_idx').on(table.created_at)
}));

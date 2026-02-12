import { db } from '@/db/index';
import { auditLogs } from '@/db/schema/index';

export const AuditService = {
    /**
     * Log an action to the audit logs
     */
    async log(data: {
        userId?: string;
        action: string;
        entityType: string;
        entityId: string;
        oldValues?: Record<string, unknown> | null;
        newValues?: Record<string, unknown> | null;
        ipAddress?: string;
        userAgent?: string;
    }) {
        try {
            await db.insert(auditLogs).values({
                user_id: data.userId || null,
                action: data.action,
                entity_type: data.entityType,
                entity_id: data.entityId,
                old_values: data.oldValues || null,
                new_values: data.newValues || null,
                ip_address: data.ipAddress || null,
                user_agent: data.userAgent || null,
            });
        } catch (error) {
            // We don't want audit logging failures to crash the main request flow
            console.error('Failed to write audit log:', error);
        }
    }
};

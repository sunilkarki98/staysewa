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
                userId: data.userId || null,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                oldValues: data.oldValues || null,
                newValues: data.newValues || null,
                ipAddress: data.ipAddress || null,
                userAgent: data.userAgent || null,
            });
        } catch (error) {
            // We don't want audit logging failures to crash the main request flow
            // But we should at least log it internally
            console.error('Failed to write audit log:', error);
        }
    }
};

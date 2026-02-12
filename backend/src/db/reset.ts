import { db, client } from '@/db/index';
import { sql } from 'drizzle-orm';

const reset = async () => {
    console.log('🗑️ Emptying database...');
    try {
        // Drop all tables in potential dependency order
        // Drop tables in dependency order (children first)
        await db.execute(sql`DROP TABLE IF EXISTS "support_messages" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "support_tickets" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "notifications" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "messages" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "reviews" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "payments" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "bookings" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "stay_media" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "price_rules" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "cancellation_policies" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "availability" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "stay_units" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "stays" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "sessions" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "owner_profiles" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "customer_profiles" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "audit_logs" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE`);

        // Drop ENUMs
        await db.execute(sql`DROP TYPE IF EXISTS "verification_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "user_role" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "unit_type" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "ticket_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "ticket_priority" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "ticket_category" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "stay_type" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "stay_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "stay_intent" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "price_rule_type" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "payout_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "payment_txn_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "payment_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "payment_method" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "notification_channel" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "media_type" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "id_type" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "cancelled_by" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "cancellation_type" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "booking_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "availability_status" CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS "adjustment_type" CASCADE`);

        console.log('✅ Database emptied');
    } catch (err) {
        console.error('❌ Reset failed:', err);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
};

reset();

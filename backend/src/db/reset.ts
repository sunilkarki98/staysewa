import { db, client } from '@/db/index';
import { sql } from 'drizzle-orm';

const reset = async () => {
    console.log('🗑️ Emptying database...');
    try {
        // Drop all tables in potential dependency order
        await db.execute(sql`DROP TABLE IF EXISTS "bookings" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "stays" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "customers" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "owners" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "admins" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE`);

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

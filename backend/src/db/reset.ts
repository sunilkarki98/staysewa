import { db, client } from '@/db/index';
import { sql } from 'drizzle-orm';

const reset = async () => {
    console.log('🗑️ Deleting everything in the public schema...');
    try {
        // Drop all tables and types in the public schema using a PL/pgSQL block
        await db.execute(sql`
            DO $$ 
            DECLARE
                r RECORD;
            BEGIN
                -- Drop all tables
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS "public"."' || r.tablename || '" CASCADE';
                END LOOP;

                -- Drop all types (enums)
                FOR r IN (SELECT t.typname FROM pg_type t 
                          JOIN pg_namespace n ON n.oid = t.typnamespace 
                          WHERE n.nspname = 'public' 
                          AND t.typtype = 'e') LOOP
                    EXECUTE 'DROP TYPE IF EXISTS "public"."' || r.typname || '" CASCADE';
                END LOOP;
            END $$;
        `);

        console.log('✅ Database is now completely empty (public schema)');
    } catch (err) {
        console.error('❌ Reset failed:', err);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
};

reset();

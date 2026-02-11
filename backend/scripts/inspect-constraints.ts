
import { db } from '../src/db/index';
import { sql } from 'drizzle-orm';

async function inspectConstraints() {
    console.log('🔍 Inspecting database check constraints...');
    try {
        const result = await db.execute(sql`
            SELECT 
                conname as constraint_name, 
                conrelid::regclass as table_name, 
                pg_get_constraintdef(c.oid) as definition
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE c.contype = 'c' 
            AND n.nspname NOT IN ('information_schema', 'pg_catalog') 
            AND n.nspname NOT LIKE 'pg_toast%' 
            AND n.nspname NOT LIKE 'pg_temp%';
        `);

        console.table(result);

        if (result.length === 0) {
            console.log('No CHECK constraints found in public schema.');
        }
    } catch (error) {
        console.error('❌ Failed to inspect constraints:', error);
    }
    process.exit(0);
}

inspectConstraints();

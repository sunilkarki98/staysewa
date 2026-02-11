
import { db } from '../src/db/index';
import { sql } from 'drizzle-orm';

async function debugQuery() {
    console.log('🔍 Debugging Drizzle Kit query...');

    try {
        const query = sql`
            SELECT 
                tc.table_schema,
                tc.table_name,
                tc.constraint_name,
                tc.constraint_type,
                pg_get_constraintdef(con.oid) AS constraint_definition
            FROM 
                information_schema.table_constraints AS tc
                JOIN pg_constraint AS con 
                    ON tc.constraint_name = con.conname
                    AND con.conrelid = (
                        SELECT oid 
                        FROM pg_class 
                        WHERE relname = tc.table_name 
                        AND relnamespace = (
                            SELECT oid 
                            FROM pg_namespace 
                            WHERE nspname = tc.constraint_schema
                        )
                    )
            WHERE 
                tc.constraint_type = 'CHECK'
                AND con.contype = 'c';
        `;

        const result = await db.execute(query);
        console.log(`Found ${result.length} check constraints.`);

        const problemRows = result.filter((r: any) => r.constraint_definition === undefined || r.constraint_definition === null);

        if (problemRows.length > 0) {
            console.error('❌ Found rows with undefined/null constraint_definition:');
            console.table(problemRows);
        } else {
            console.log('✅ All constraints have valid definitions.');
            if (result.length > 0) {
                console.log('Sample row:', result[0]);
            }
        }

    } catch (error) {
        console.error('❌ Query failed:', error);
    }
    process.exit(0);
}

debugQuery();

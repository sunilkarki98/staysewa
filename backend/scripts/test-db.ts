import { db } from '@/db/index';
import { sql } from 'drizzle-orm';

async function testConnection() {
    console.log('🔄 Testing database connection...');
    try {
        const result = await db.execute(sql`SELECT 1 as connected`);
        if (result && result.length > 0) {
            console.log('✅ Database connection successful!');
            console.log('Timestamp:', new Date().toISOString());
        } else {
            console.error('❌ Database connection failed: No result returned.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Database connection failed with error:');
        console.error(error);
        process.exit(1);
    }
    process.exit(0);
}

testConnection();

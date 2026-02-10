import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, client } from './index';

const runMigrations = async () => {
    console.log('⏳ Running migrations...');
    const start = Date.now();

    try {
        // This will run migrations on the database, skipping the ones already applied
        await migrate(db, { migrationsFolder: './drizzle' });

        const end = Date.now();
        console.log(`✅ Migrations completed in ${end - start}ms`);

        // Configured connection is for "Transaction" mode which might not support clean exit? 
        // Usually we close connection.
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed');
        console.error(err);
        await client.end();
        process.exit(1);
    }
};

runMigrations();

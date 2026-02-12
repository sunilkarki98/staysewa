import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

const connectionString = env.DATABASE_URL;

// Connection pool tuned for Supabase Transaction mode
export const client = postgres(connectionString, {
    prepare: false,       // Required for Supabase Transaction pool mode
    ssl: 'require',
    max: 10,              // Max connections
    idle_timeout: 20,     // Close idle connections after 20s
    max_lifetime: 60 * 5, // Recycle connections every 5 minutes
});

// Add basic connection logging
client`SELECT 1`.then(() => {
    logger.info('Database connected successfully');
}).catch((err) => {
    logger.error(err, 'Database connection failed');
});

export const db = drizzle(client, { schema });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"; // Using 'postgres' driver (postgres.js) as instructed in Drizzle docs usually
import * as schema from "@/db/schema/index";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

// Connection pool tuned for Supabase Transaction mode
export const client = postgres(connectionString, {
    prepare: false,       // Required for Supabase Transaction pool mode
    ssl: 'require',
    max: 10,              // Max connections (adjust based on Supabase plan)
    idle_timeout: 20,     // Close idle connections after 20s
    max_lifetime: 60 * 5, // Recycle connections every 5 minutes
});
export const db = drizzle(client, { schema });

import { defineConfig } from "drizzle-kit";

// Use direct connection (port 5432) for schema operations instead of
// the transaction pooler (port 6543) which doesn't support DDL/introspection.
const dbUrl = process.env.DATABASE_URL!.replace(":6543/", ":5432/");

export default defineConfig({
    schema: "./src/db/schema",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: dbUrl + "?sslmode=require",
    },
    schemaFilter: ["public"],
});

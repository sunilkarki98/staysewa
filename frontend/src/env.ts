import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Server-side environment variables (not exposed to the browser).
     * Prefix with anything other than NEXT_PUBLIC_.
     */
    server: {},

    /**
     * Client-side environment variables (exposed to the browser).
     * Must be prefixed with NEXT_PUBLIC_.
     */
    client: {
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
        NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000/api"),
        NEXT_PUBLIC_AUTH_REQUIRED: z
            .enum(["true", "false"])
            .default("true")
            .transform((v) => v === "true"),
    },

    /**
     * Map env vars to their runtime values.
     * Required because Next.js statically replaces process.env at build time.
     */
    runtimeEnv: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_AUTH_REQUIRED: process.env.NEXT_PUBLIC_AUTH_REQUIRED,
    },

    /**
     * Skip validation in CI/Docker build steps where env vars aren't available.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

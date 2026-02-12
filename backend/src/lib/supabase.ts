import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    console.warn('⚠️ Supabase credentials missing. Storage ops will fail.');
}

// Initialize Supabase Client with Service Role Key for backend admin access
export const supabase = createClient(
    env.SUPABASE_URL || '',
    env.SUPABASE_SERVICE_KEY || '',
    {
        auth: {
            persistSession: false, // No session needed for backend
            autoRefreshToken: false,
        }
    }
);

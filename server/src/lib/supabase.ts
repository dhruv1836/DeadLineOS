import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Missing Supabase environment variables. Database routes will reject requests until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.');
}

// Service role client for server-side admin tasks
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  console.warn('WARNING: Supabase credentials not set. DB operations will fail.');
}

export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://pzfxlzpnsnldlnhlinwo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'sb_publishable_6yqDqTHgQE-6mWliD3nBcw_1cHpOpbV';

function resolveEnvValue(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
}

const env = import.meta.env as Record<string, unknown> | undefined;

export const SUPABASE_URL = resolveEnvValue(
  env?.VITE_SUPABASE_URL,
  DEFAULT_SUPABASE_URL,
);

export const SUPABASE_ANON_KEY = resolveEnvValue(
  env?.VITE_SUPABASE_ANON_KEY,
  DEFAULT_SUPABASE_ANON_KEY,
);

export const SUPABASE_MEDIA_BUCKET = 'gang-sabarang-media';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

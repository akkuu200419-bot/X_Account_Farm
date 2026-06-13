import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && key && url.startsWith('http')
    ? createClient(url, key)
    : null;

export interface DbAccount {
  id: string;
  ts: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  handle: string | null;
  password: string | null;
  device: string | null;
  status: string;
  totp_secret: string | null;
}

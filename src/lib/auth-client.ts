import { createBrowserClient } from '@supabase/ssr';
import { env } from './env';

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient(): ReturnType<typeof createBrowserClient> {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return supabaseClient;
}

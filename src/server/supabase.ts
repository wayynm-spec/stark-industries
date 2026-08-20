import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let supabaseServerClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseServerClient(): ReturnType<typeof createClient> {
  if (!supabaseServerClient) {
    supabaseServerClient = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return supabaseServerClient;
}

export const supabase = getSupabaseServerClient();

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a request-time Supabase client for server-side operations.
 * Uses SERVICE_ROLE_KEY to bypass RLS for system operations.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("❌ SUPABASE_URL:", url ? "SET" : "MISSING");
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? "SET" : "MISSING");
    throw new Error(`❌ Server Error: Missing critical Supabase config. URL: ${url ? 'OK' : 'MISSING'}, KEY: ${serviceKey ? 'OK' : 'MISSING'}`);
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

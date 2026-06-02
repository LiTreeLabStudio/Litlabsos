import { createClient } from "@supabase/supabase-js";

/**
 * Creates a request-time Supabase client for server-side operations.
 * Uses SERVICE_ROLE_KEY to bypass RLS for system operations.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    // Only throw at runtime when the function is actually called
    throw new Error("❌ Server Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Singleton Supabase client for browser-side execution.
 * Throws an error if env vars are missing to prevent silent failures in production.
 */
function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // In production browser context, this should be set.
    // During build-time static analysis, we handle this carefully via dynamic markers.
    if (typeof window !== "undefined") {
      throw new Error("❌ Client Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseBrowserClient();

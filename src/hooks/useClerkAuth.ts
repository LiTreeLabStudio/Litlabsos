"use client";

import { useSupabaseAuth } from "@/app/supabase-auth";

export function useClerkAuth() {
  const { user, loading } = useSupabaseAuth();
  return {
    isLoaded: !loading,
    isSignedIn: !!user,
  };
}

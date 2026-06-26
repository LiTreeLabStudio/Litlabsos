"use client";

import { useSupabaseAuth } from "@/app/supabase-auth";

export function useSupabaseAuthHook() {
  const { user, loading, signIn, signOut } = useSupabaseAuth();
  const sessionClaims = user ? {
    name: (user.user_metadata?.name || user.user_metadata?.full_name || null) as string | null,
    username: (user.user_metadata?.username || user.email || null) as string | null,
  } : undefined;

  return {
    user,
    loading,
    isLoaded: !loading,
    isSignedIn: !!user,
    userId: user?.id || null,
    sessionClaims,
    signIn,
    signOut,
  };
}

export { useSupabaseAuth };

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabase } from "@/lib/supabase";

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

interface SupabaseAuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.auth.getUser();
        if (mounted) {
          setUser(data?.user ?? null);
          setLoading(false);
        }
      } catch {
        // Supabase not configured
        if (mounted) setLoading(false);
      }
    };
    initAuth();
    return () => { mounted = false; };
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data?.user ?? null);
  };

  const signOut = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <SupabaseAuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  return useContext(SupabaseAuthContext);
}

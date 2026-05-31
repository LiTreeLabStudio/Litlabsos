// @ts-nocheck
// Homebase-3.0: Supabase Auth Example
// Place in frontend/src/lib/supabaseAuth.ts

import { supabase } from './supabaseClient';

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

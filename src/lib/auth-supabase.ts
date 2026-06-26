import { createClient } from "@/app/supabase-server"

// Supabase auth middleware replacement for Clerk's auth()
export async function getSupabaseAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { userId: null }
  }

  return { userId: user.id, user }
}

// Helper function for protected routes
export async function requireSupabaseAuth() {
  const auth = await getSupabaseAuth()
  if (!auth.userId) {
    throw new Error("Unauthorized")
  }
  return auth
}

// Create a client-side version for API routes
export async function getSupabaseClientAuth(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { userId: null }
  }

  return { userId: user.id, user }
}
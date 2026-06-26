import { NextResponse } from "next/server"
import { getSupabaseAuth } from "@/lib/auth-supabase"
import { getSupabase } from "@/lib/supabase"

export async function POST() {
  const { userId, user } = await getSupabaseAuth()
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const sb = getSupabase()

  try {
    // Check if user exists
    const { data: existing } = await sb
      .from("users")
      .select("id, supabase_id, username")
      .eq("supabase_id", userId)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        user: existing,
        message: "User already exists",
      })
    }

    // Get user info from Supabase
    // Generate a username from userId
    const shortId = userId.slice(-8)
    const username = `user_${shortId}`
    const displayName = `LiTBit User ${shortId}`

    // Create user in Supabase
    const { data: newUser, error } = await sb
      .from("users")
      .insert({
        supabase_id: userId,
        email: user?.email || `${userId}@supabase.litlabs.net`,
        name: user?.user_metadata?.full_name || displayName,
        username: username,
        display_name: user?.user_metadata?.full_name || displayName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    // Create initial wallet
    await sb.from("wallets").insert({
      user_id: newUser.id,
      balance: 500, // Starting bonus
      lifetime_earned: 500,
    })

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "User created successfully",
      startingBalance: 500,
    })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// Also allow GET for simple check
export async function GET() {
  const { userId } = await getSupabaseAuth()
  if (!userId) {
    return NextResponse.json(
      { exists: false, error: "Not authenticated" },
      { status: 401 }
    )
  }

  const sb = getSupabase()

  const { data: user } = await sb
    .from("users")
    .select("id, username, display_name")
    .eq("supabase_id", userId)
    .single()

  return NextResponse.json({
    exists: !!user,
    user: user || null,
  })
}
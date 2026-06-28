import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/user-db";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown error";
}

/**
 * GET /api/account
 * Ensures the user exists in our database. Called on every page load via UserSync.
 */
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = clerkUser.firstName && clerkUser.lastName
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.firstName || clerkUser.username || email.split("@")[0];

    const { user, isNew } = await getOrCreateUser(clerkId, email, name);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to sync user account" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      synced: true,
      isNew,
      user,
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/account:", error);
    return NextResponse.json(
      { synced: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/account
 * Deletes the current user's account and all associated data from Supabase.
 */
export async function DELETE() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user from Supabase using admin client (cascades to other tables)
    const { error } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error deleting user from database:", error);
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Account deletion successful",
    });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/account:", error);
    return NextResponse.json(
      { error: "Failed to delete account", details: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

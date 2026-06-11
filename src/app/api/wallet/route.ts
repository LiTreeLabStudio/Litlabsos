import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserWallet, updateWalletBalance, claimDailyBonus, getOrCreateUser } from "@/lib/user-db";
import { withRateLimit } from "@/lib/rate-limiter";

/**
 * GET /api/wallet
 * Returns the user's LiTBit Coins wallet balance.
 */
async function getHandler(_req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let wallet = await getUserWallet(clerkId);
    
    if (!wallet) {
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress || "";
      const name = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "";
      
      const result = await getOrCreateUser(clerkId, email, name);
      wallet = await getUserWallet(clerkId);

      if (!wallet) {
        return NextResponse.json({
          balance: 500,
          last_claim_date: null,
          message: "New wallet created with 500 LiTBit Coins",
        });
      }
    }

    return NextResponse.json({
      balance: wallet.balance,
      last_claim_date: wallet.last_claim_date,
      updated_at: wallet.updated_at,
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallet/claim
 * Claims the daily bonus of 50 LiTBit Coins.
 * Body: { type: "daily" }
 */
async function postHandler(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    
    if (!body || body.type !== "daily") {
      return NextResponse.json(
        { error: "Invalid request. Use { type: 'daily' }" },
        { status: 400 }
      );
    }

    // Ensure user exists before claiming
    let wallet = await getUserWallet(clerkId);
    if (!wallet) {
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress || "";
      const name = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "";
      await getOrCreateUser(clerkId, email, name);
    }

    wallet = await claimDailyBonus(clerkId, 50);

    return NextResponse.json({
      message: "Daily bonus claimed! +50 LiTBit Coins",
      balance: wallet.balance,
      last_claim_date: wallet.last_claim_date,
    });
  } catch (error: any) {
    console.error("Error claiming bonus:", error);
    
    if (error.message === "Daily bonus already claimed") {
      return NextResponse.json(
        { error: "Daily bonus already claimed today" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to claim bonus: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/wallet
 * Updates wallet balance (for purchases, earnings, etc.)
 * Body: { amount: number } - positive for earnings, negative for purchases
 */
async function putHandler(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    
    if (!body || typeof body.amount !== "number") {
      return NextResponse.json(
        { error: "Invalid request. amount (number) is required" },
        { status: 400 }
      );
    }

    const currentWallet = await getUserWallet(clerkId);
    if (!currentWallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const newBalance = currentWallet.balance + body.amount;
    
    if (newBalance < 0) {
      return NextResponse.json(
        { error: "Insufficient balance", currentBalance: currentWallet.balance },
        { status: 400 }
      );
    }

    const wallet = await updateWalletBalance(clerkId, newBalance);

    return NextResponse.json({
      message: body.amount > 0 
        ? `+${body.amount} LiTBit Coins added` 
        : `${Math.abs(body.amount)} LiTBit Coins deducted`,
      balance: wallet.balance,
      previousBalance: currentWallet.balance,
      change: body.amount,
    });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      { error: "Failed to update wallet" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(getHandler, 100, 60);
export const POST = withRateLimit(postHandler, 10, 60); // Stricter limit for claiming
export const PUT = withRateLimit(putHandler, 50, 60);

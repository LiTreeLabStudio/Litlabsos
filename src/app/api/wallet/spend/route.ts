import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserWallet, updateWalletBalance, getOrCreateUser } from "@/lib/user-db";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, type = "spend" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Ensure user exists
    let wallet = await getUserWallet(clerkId);
    if (!wallet) {
      const { currentUser } = await import("@clerk/nextjs/server");
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress || "";
      const name = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "";
      await getOrCreateUser(clerkId, email, name);
      wallet = await getUserWallet(clerkId);
    }

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const newBalance = wallet.balance - amount;
    if (newBalance < 0) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    await updateWalletBalance(clerkId, newBalance);

    return NextResponse.json({
      success: true,
      balance: newBalance,
      spent: amount,
    });
  } catch (error) {
    console.error("Wallet spend error:", error);
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
  }
}

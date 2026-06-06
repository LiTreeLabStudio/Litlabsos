"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * Ensures the user exists in the database on every page load.
 * Calls /api/account which triggers getOrCreateUser.
 */
export default function UserSync() {
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isSignedIn || !userId) return;

    // Ping the account API to ensure user record exists
    fetch("/api/account", { method: "GET" })
      .then((res) => {
        if (!res.ok) console.warn("[UserSync] Account sync failed:", res.status);
      })
      .catch(() => {
        // Silent fail — webhook will handle it later
      });
  }, [isSignedIn, userId]);

  return null;
}

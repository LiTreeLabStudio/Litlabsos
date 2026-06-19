"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;
  if (isSignedIn) return null;

  return <DashboardContent />;
}

"use client";
import SocialMatrix from "@/components/SocialMatrix";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || "Builder";

  return (
    <div className="w-full flex flex-col gap-6 pt-4">
      <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Your AI agent fleet is running. Here&apos;s what&apos;s happening.
        </p>
      </div>

      <SocialMatrix />
    </div>
  );
}

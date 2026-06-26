"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { useTheme } from "@/context/ThemeContext";
import { APPS } from "@/components/dashboard/dashboard-data";
import { CenterStage } from "@/components/dashboard/DashboardCards";
import DashboardWidgets from "@/components/dashboard/DashboardWidgets";
import Link from "next/link";
import { useAppLayout } from "@/hooks/useAppLayout";

export default function DashboardView() {
  const { user } = useUser();
  const { profile } = useProfile();
  const { resolvedColors: T } = useTheme();
  const searchParams = useSearchParams();
  const activeApp = searchParams?.get("tab") || "home";
  const [balance, setBalance] = useState<number>(9999);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const visitors = 133742;

  const { layout: appLayout } = useAppLayout();

  const displayName =
    profile?.displayName || user?.firstName || user?.username || "Creator";

  // Load real balance + claim status from the API on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/wallet")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (typeof data.balance === "number") {
          setBalance(data.balance);
          localStorage.setItem("litcoins", String(data.balance));
        }
        if (data.last_claim_date) {
          const lastClaim = new Date(data.last_claim_date);
          const now = new Date();
          const sameDay =
            lastClaim.getFullYear() === now.getFullYear() &&
            lastClaim.getMonth() === now.getMonth() &&
            lastClaim.getDate() === now.getDate();
          setClaimed(sameDay);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const stored = localStorage.getItem("litcoins");
        if (stored) setBalance(parseInt(stored) || 9999);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const claimDaily = async () => {
    if (claimed || claiming) return;
    setClaiming(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "daily" }),
      });
      const data = await res.json();
      if (res.ok && typeof data.balance === "number") {
        setBalance(data.balance);
        setClaimed(true);
        localStorage.setItem("litcoins", String(data.balance));
        window.dispatchEvent(
          new CustomEvent("wallet-updated", {
            detail: { balance: data.balance },
          }),
        );
      } else if (data.error === "Daily bonus already claimed today") {
        setClaimed(true);
      }
    } catch {
      const next = balance + 100;
      setBalance(next);
      setClaimed(true);
      localStorage.setItem("litcoins", String(next));
    } finally {
      setClaiming(false);
    }
  };

  // Reconstruct sorted/filtered APPS array based on layout
  const sortedApps = appLayout.order
    .map((id) => APPS.find((app) => app.id === id))
    .filter((app): app is typeof APPS[number] => !!app);

  const visibleApps = sortedApps.filter((app) => !appLayout.hidden.includes(app.id));

  return (
    <div
      className="flex w-full h-full relative"
      style={{ backgroundColor: T.bgColor, color: T.textColor }}
    >
      {/* Center Content */}
      <div
        className={`flex-1 min-w-0 p-4 lg:p-6 ${
          activeApp === "jarvis"
            ? "flex flex-col overflow-hidden"
            : "overflow-y-auto animate-fadeIn"
        }`}
      >
        {/* Mobile app bar */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {visibleApps.map((app) => {
            const Icon = app.icon;
            const active = activeApp === app.id;
            const hasPage = app.href && app.href !== "#";
            const mobileStyle = {
              backgroundColor: active ? `${app.color}15` : `${T.boxBg}60`,
              border: active
                ? `1px solid ${app.color}40`
                : `1px solid ${T.borderColor}30`,
              color: active ? app.color : T.textMuted,
            };
            const mobileInner = (
              <>
                <Icon size={14} />
                {app.label}
              </>
            );
            return hasPage ? (
              <Link
                key={app.id}
                href={app.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
                style={mobileStyle}
              >
                {mobileInner}
              </Link>
            ) : (
              <Link
                key={app.id}
                href={`/?tab=${app.id}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
                style={mobileStyle}
              >
                {mobileInner}
              </Link>
            );
          })}
        </div>

        <CenterStage activeApp={activeApp} displayName={displayName} />
      </div>

      {/* Right Widgets */}
      <DashboardWidgets
        displayName={displayName}
        balance={balance}
        claimed={claimed}
        visitors={visitors}
        onClaimAction={claimDaily}
      />
    </div>
  );
}


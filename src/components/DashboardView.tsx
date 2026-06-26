"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useProfile } from "@/context/ProfileContext";
import { useTheme } from "@/context/ThemeContext";
import { APPS } from "@/components/dashboard/dashboard-data";
import { CenterStage } from "@/components/dashboard/DashboardCards";
import DashboardWidgets from "@/components/dashboard/DashboardWidgets";
import Link from "next/link";
import { useAppLayout } from "@/hooks/useAppLayout";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  EyeOff,
  GripVertical,
  RotateCcw,
} from "lucide-react";

export default function DashboardView({
  initialApp = "home",
}: {
  initialApp?: string;
}) {
  const { user } = useUser();
  const { profile } = useProfile();
  const { resolvedColors: T } = useTheme();
  const [activeApp, setActiveApp] = useState(initialApp);
  const [balance, setBalance] = useState<number>(9999);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [sidebarEditMode, setSidebarEditMode] = useState(false);
  const visitors = 133742;

  // Drag states for Left Dock reordering
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverAppId, setDragOverAppId] = useState<string | null>(null);

  const {
    layout: appLayout,
    reorder: reorderApp,
    toggleVisibility: toggleVisibilityApp,
    setCollapsed: setCollapsedApp,
    reset: resetAppLayout,
  } = useAppLayout();

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

  const visibleApps = sidebarEditMode
    ? sortedApps
    : sortedApps.filter((app) => !appLayout.hidden.includes(app.id));

  // Drag handlers
  const handleDragStart = (id: string) => {
    setDraggedAppId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverAppId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedAppId && draggedAppId !== targetId) {
      const fromIdx = appLayout.order.indexOf(draggedAppId);
      const toIdx = appLayout.order.indexOf(targetId);
      if (fromIdx !== -1 && toIdx !== -1) {
        reorderApp(fromIdx, toIdx);
      }
    }
    setDraggedAppId(null);
    setDragOverAppId(null);
  };

  return (
    <div
      className="flex w-full h-full relative"
      style={{ backgroundColor: T.bgColor, color: T.textColor }}
    >
      {/* Sidebar Expand Trigger (when collapsed) */}
      {appLayout.collapsed && (
        <button
          onClick={() => setCollapsedApp(false)}
          className="absolute left-2 top-4 z-50 p-1.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105"
          style={{
            backgroundColor: T.bgColor,
            borderColor: `${T.borderColor}40`,
            color: T.accentColor,
            boxShadow: "var(--shadow-glow)",
          }}
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Left Dock */}
      <aside
        className={`hidden md:flex flex-col items-center py-4 gap-2 shrink-0 border-r overflow-y-auto scrollbar-hide transition-all duration-300 relative ${
          appLayout.collapsed ? "w-0 p-0 overflow-hidden border-r-0" : "w-16"
        }`}
        style={{
          borderColor: `${T.borderColor}30`,
          backgroundColor: `${T.bgColor}80`,
        }}
      >
        {!appLayout.collapsed && (
          <>
            {/* Collapse Trigger */}
            <button
              onClick={() => setCollapsedApp(true)}
              className="w-11 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:bg-white/5 opacity-55 hover:opacity-100 mb-1"
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Apps List */}
            <div className="flex-1 flex flex-col gap-2 w-full items-center">
              {visibleApps.map((app) => {
                const Icon = app.icon;
                const active = activeApp === app.id;
                const isHidden = appLayout.hidden.includes(app.id);
                const hasPage = app.href && app.href !== "#";
                const isDraggingThis = draggedAppId === app.id;
                const isDragOverThis = dragOverAppId === app.id;

                const sharedStyle = {
                  backgroundColor: active ? `${app.color}15` : "transparent",
                  border: active
                    ? `1px solid ${app.color}40`
                    : isDragOverThis
                    ? `1px solid ${app.color}60`
                    : "1px solid transparent",
                  opacity: isHidden ? 0.35 : isDraggingThis ? 0.4 : 1,
                };

                const inner = (
                  <>
                    <Icon
                      size={20}
                      style={{ color: active ? app.color : T.textMuted }}
                    />
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                        style={{ backgroundColor: app.color }}
                      />
                    )}

                    {/* Edit mode overlay badge */}
                    {sidebarEditMode && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleVisibilityApp(app.id);
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center cursor-pointer hover:scale-105 z-20"
                        title={isHidden ? "Show app" : "Hide app"}
                      >
                        {isHidden ? (
                          <EyeOff size={9} className="text-red-400" />
                        ) : (
                          <Eye size={9} className="text-emerald-400" />
                        )}
                      </button>
                    )}

                    {/* Tooltip */}
                    {!sidebarEditMode && (
                      <span
                        className="absolute left-14 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                        style={{
                          backgroundColor: T.boxBg,
                          border: `1px solid ${T.borderColor}40`,
                          color: T.textColor,
                        }}
                      >
                        {app.label}
                      </span>
                    )}
                  </>
                );

                const componentProps = {
                  key: app.id,
                  draggable: sidebarEditMode,
                  onDragStart: () => handleDragStart(app.id),
                  onDragOver: (e: React.DragEvent) => handleDragOver(e, app.id),
                  onDrop: (e: React.DragEvent) => handleDrop(e, app.id),
                  className: `relative group w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    sidebarEditMode ? "cursor-grab active:cursor-grabbing" : ""
                  }`,
                  style: sharedStyle,
                  title: sidebarEditMode ? `Drag to reorder ${app.label}` : app.label,
                };

                return hasPage && !sidebarEditMode ? (
                  <Link href={app.href} {...componentProps}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (!sidebarEditMode) setActiveApp(app.id);
                    }}
                    {...componentProps}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>

            {/* Sidebar Customizer Controls */}
            <div className="mt-auto flex flex-col gap-1 w-full items-center border-t border-white/5 pt-3">
              {sidebarEditMode && (
                <button
                  onClick={resetAppLayout}
                  className="w-11 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:bg-white/5 text-amber-500 mb-1"
                  title="Reset layout"
                >
                  <RotateCcw size={14} />
                </button>
              )}
              <button
                onClick={() => setSidebarEditMode(!sidebarEditMode)}
                className={`w-11 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                  sidebarEditMode ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40" : "opacity-55 hover:opacity-100"
                }`}
                title={sidebarEditMode ? "Exit sidebar customization" : "Customize sidebar links"}
              >
                <Settings size={15} className={sidebarEditMode ? "animate-spin" : ""} style={{ animationDuration: "8s" }} />
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Center */}
      <main
        className={`flex-1 min-w-0 p-4 lg:p-6 ${
          activeApp === "jarvis"
            ? "flex flex-col overflow-hidden"
            : "overflow-y-auto"
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
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
                style={mobileStyle}
              >
                {mobileInner}
              </button>
            );
          })}
        </div>

        <CenterStage activeApp={activeApp} displayName={displayName} />
      </main>

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


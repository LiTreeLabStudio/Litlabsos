"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAppLayout } from "@/hooks/useAppLayout";
import { APPS } from "@/components/dashboard/dashboard-data";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";

export default function LeftDock() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedColors: T } = useTheme();
  const [sidebarEditMode, setSidebarEditMode] = useState(false);

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

  // Determine active app based on current pathname and query params
  let activeApp = "home";
  if (pathname === "/studio" || pathname?.startsWith("/studio")) {
    activeApp = "studio";
  } else if (pathname === "/games" || pathname?.startsWith("/games")) {
    activeApp = "games";
  } else if (pathname === "/gallery" || pathname?.startsWith("/gallery")) {
    activeApp = "gallery";
  } else if (pathname === "/agent" || pathname?.startsWith("/agent")) {
    activeApp = "jarvis";
  } else if (pathname === "/agents" || pathname?.startsWith("/agents")) {
    activeApp = "agents";
  } else if (pathname === "/marketplace" || pathname?.startsWith("/marketplace")) {
    activeApp = "marketplace";
  } else if (pathname === "/") {
    const tab = searchParams?.get("tab");
    if (tab) activeApp = tab;
  }

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
    <div className="relative shrink-0 z-40 flex h-full">
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

                // Link in-dashboard apps to /?tab=id, and page apps to their pages
                const targetHref = hasPage ? app.href : `/?tab=${app.id}`;

                return !sidebarEditMode ? (
                  <Link href={targetHref} {...componentProps}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (!sidebarEditMode) {
                        router.push(targetHref);
                      }
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
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";

export interface AppLayoutState {
  order: string[];
  hidden: string[];
  collapsed: boolean;
}

const STORAGE_KEY = "litlabs-app-layout";

export const DEFAULT_APP_ORDER = [
  "home",
  "studio",
  "games",
  "gallery",
  "jarvis",
  "agents",
  "marketplace",
];

function loadAppLayout(): AppLayoutState {
  if (typeof window === "undefined") {
    return { order: DEFAULT_APP_ORDER, hidden: [], collapsed: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { order: DEFAULT_APP_ORDER, hidden: [], collapsed: false };
    const parsed = JSON.parse(raw) as AppLayoutState;
    const known = new Set(DEFAULT_APP_ORDER);
    const order = [
      ...parsed.order.filter((id) => known.has(id)),
      ...DEFAULT_APP_ORDER.filter((id) => !parsed.order.includes(id)),
    ];
    const hidden = (parsed.hidden || []).filter((id) => known.has(id));
    const collapsed = !!parsed.collapsed;
    return { order, hidden, collapsed };
  } catch {
    return { order: DEFAULT_APP_ORDER, hidden: [], collapsed: false };
  }
}

export function useAppLayout() {
  const [layout, setLayout] = useState<AppLayoutState>(() => loadAppLayout());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    }
  }, [layout, mounted]);

  const reorder = useCallback((from: number, to: number) => {
    setLayout((prev) => {
      const order = [...prev.order];
      const [moved] = order.splice(from, 1);
      order.splice(to, 0, moved);
      return { ...prev, order };
    });
  }, []);

  const moveUp = useCallback((id: string) => {
    setLayout((prev) => {
      const idx = prev.order.indexOf(id);
      if (idx <= 0) return prev;
      const order = [...prev.order];
      [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
      return { ...prev, order };
    });
  }, []);

  const moveDown = useCallback((id: string) => {
    setLayout((prev) => {
      const idx = prev.order.indexOf(id);
      if (idx < 0 || idx >= prev.order.length - 1) return prev;
      const order = [...prev.order];
      [order[idx], order[idx + 1]] = [order[idx + 1], order[idx]];
      return { ...prev, order };
    });
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setLayout((prev) => {
      const hidden = prev.hidden.includes(id)
        ? prev.hidden.filter((h) => h !== id)
        : [...prev.hidden, id];
      return { ...prev, hidden };
    });
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setLayout((prev) => ({ ...prev, collapsed }));
  }, []);

  const reset = useCallback(() => {
    setLayout({ order: DEFAULT_APP_ORDER, hidden: [], collapsed: false });
  }, []);

  return {
    layout: mounted ? layout : { order: DEFAULT_APP_ORDER, hidden: [], collapsed: false },
    reorder,
    moveUp,
    moveDown,
    toggleVisibility,
    setCollapsed,
    reset,
  };
}

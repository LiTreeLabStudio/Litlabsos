"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useMounted } from "@/hooks/useMounted";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMounted = useMounted();
  const [nodeId, setNodeId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setNodeId(Math.random().toString(36).substring(7).toUpperCase());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-volcanic-bg overflow-hidden">
      {/* Dashboard Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard Top Header (Optional internal header) */}
        <header className="h-12 border-b border-volcanic-border bg-volcanic-surface flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-volcanic-accent font-bold uppercase tracking-widest">
              System Status:
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-volcanic-accent animate-pulse" />
              <span className="text-[10px] font-mono text-volcanic-text/70 uppercase">
                Syncing Neural Core...
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-mono text-volcanic-text/40">
               NODE_ID: {nodeId || "INITIALIZING..."}
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import DashboardGrid from "@/components/DashboardGrid";
import AgentMonitor from "@/components/AgentMonitor";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AgentMonitor />
      <DashboardGrid />
    </div>
  );
}

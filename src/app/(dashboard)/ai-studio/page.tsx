"use client";
import AIStudioHub from "@/components/AIStudioHub";
import StatusBadge from "@/components/StatusBadge";

export default function AIStudioPage() {
  return (
    <div className="h-[calc(100vh-112px)] flex flex-col">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            AI Studio <span className="gradient-text">Hub</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Autonomous design playground powered by Gemini 2.0 Flash.</p>
        </div>
        <StatusBadge />
      </div>
      <div className="flex-1 overflow-hidden">
        <AIStudioHub />
      </div>
    </div>
  );
}

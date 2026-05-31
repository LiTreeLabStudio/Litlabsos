"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LiveTerminal({ sessionId }: { sessionId: string }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("logs")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (data) setLogs(data);
    };
    fetchLogs();

    const channel = supabase
      .channel("realtime_logs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "logs",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: { new: any }) => {
          setLogs((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return (
    <div className="bg-black/60 text-green-400 font-mono p-4 rounded-xl h-64 overflow-y-auto border border-white/8">
      <div className="mb-2 border-b border-green-900 pb-2 text-xs">
        <span className="text-brand-orange">●</span> Agent Activity Log
      </div>
      {logs.length === 0 && (
        <div className="text-zinc-600 text-xs">Waiting for agent activity...</div>
      )}
      {logs.map((log) => (
        <div key={log.id} className="py-0.5 text-xs">
          <span className="text-zinc-600">[{new Date(log.created_at).toLocaleTimeString()}]</span>{" "}
          {log.level === "error" ? (
            <span className="text-red-400">{log.message}</span>
          ) : (
            <span className="text-green-400/80">{log.message}</span>
          )}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface LogEntry {
  id: string;
  created_at: string;
  level: string;
  message: string;
  session_id: string;
}

export default function LiveTerminal({ sessionId }: { sessionId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase not configured. LiveTerminal is in offline mode.");
      return;
    }

    // Fetch existing logs for this session
    const fetchLogs = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("logs")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (data) setLogs(data);
    };
    fetchLogs();

    // Subscribe to real-time inserts
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
        (payload) => {
          setLogs((prev) => [...prev, payload.new as LogEntry]);
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId]);

  return (
    <div className="bg-zinc-950 border border-orange-500/30 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] text-orange-500 font-mono p-4 rounded-none h-96 overflow-y-auto relative">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
      <div className="mb-2 border-b border-orange-900/50 pb-2 relative z-10">
        <span className="text-orange-400 animate-pulse">SYSTEM:</span> Listening for Executor output...
      </div>
      {logs.map((log) => (
        <div key={log.id} className="py-1">
          <span className="text-gray-500">[{new Date(log.created_at).toLocaleTimeString()}]</span>{" "}
          {log.level === "error" ? (
            <span className="text-red-500">{log.message}</span>
          ) : (
            <span>{log.message}</span>
          )}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LiveTerminal({ sessionId }: { sessionId: string }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch existing logs for this session
    const fetchLogs = async () => {
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
    <div className="bg-black text-green-500 font-mono p-4 rounded-lg h-96 overflow-y-auto">
      <div className="mb-2 border-b border-green-800 pb-2">
        <span className="text-green-300">SYSTEM:</span> Listening for Executor output...
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

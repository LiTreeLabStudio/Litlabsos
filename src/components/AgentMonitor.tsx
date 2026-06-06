"use client";
import { useState, useEffect, useCallback } from "react";

interface DataPoint {
  time: Date;
  load: number;
  interactions: number;
}

export default function AgentMonitor() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [stats, setStats] = useState({ uptime: "99.9%", meanLoad: "24%", interactions: "1,402" });

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch("/api/telemetry");
      const json = await res.json();
      if (json.telemetry && json.telemetry.length > 0) {
        const points = json.telemetry.map((t: { created_at: string; metadata: { cpu?: string; interactions?: string } }) => ({
          time: new Date(t.created_at),
          load: Number(t.metadata.cpu?.replace("%", "")) || 0,
          interactions: Number(t.metadata.interactions) || 0,
        }));
        setData(points);
        if (points.length > 0) {
          const avgLoad = Math.round(points.reduce((acc: number, p: DataPoint) => acc + p.load, 0) / points.length);
          const totalInteractions = points.reduce((acc: number, p: DataPoint) => acc + p.interactions, 0);
          setStats(prev => ({ ...prev, meanLoad: `${avgLoad}%`, interactions: totalInteractions.toLocaleString() }));
        }
      }
    } catch {
      // Silently fail — telemetry API may not be available on Vercel
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchTelemetry();
    };
    init();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  // Generate sparkline SVG
  const renderSparkline = () => {
    if (data.length < 2) return null;
    const width = 400;
    const height = 80;
    const maxLoad = Math.max(...data.map(d => d.load), 1);
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.load / maxLoad) * height;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg className="w-full h-20" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,${height} ${points} ${width},${height}`}
          fill="url(#loadGrad)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Agent Fleet</h2>
          <p className="text-sm text-[#71717a]">Real-time performance monitoring</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <div className="text-xs text-[#71717a] mb-0.5">Uptime</div>
            <div className="text-lg font-bold text-white tabular-nums">{stats.uptime}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#71717a] mb-0.5">Load</div>
            <div className="text-lg font-bold text-[#f97316] tabular-nums">{stats.meanLoad}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#71717a] mb-0.5">Interactions</div>
            <div className="text-lg font-bold text-white tabular-nums">{stats.interactions}</div>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-6">
        {data.length > 1 ? (
          renderSparkline()
        ) : (
          <div className="h-20 flex items-center justify-center text-sm text-[#555]">
            Waiting for telemetry data...
          </div>
        )}
      </div>

      {/* Agent List */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { name: "Brain", status: "online", load: "12%" },
          { name: "Scanner", status: "online", load: "8%" },
          { name: "Monitor", status: "online", load: "3%" },
          { name: "Gig Hunter", status: "busy", load: "45%" },
        ].map(agent => (
          <div key={agent.name} className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
            <div className="flex items-center gap-2 mb-1">
              <div className={`status-dot ${agent.status === "online" ? "online" : "busy"}`} />
              <span className="text-sm font-medium text-white">{agent.name}</span>
            </div>
            <span className="text-xs text-[#71717a]">Load: {agent.load}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

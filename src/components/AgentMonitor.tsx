"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  time: Date;
  load: number;
  interactions: number;
}

export default function AgentMonitor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [stats, setStats] = useState({ uptime: "99.98%", meanLoad: "0%", interactions: "0" });

  const fetchTelemetry = async () => {
    try {
      const res = await fetch("/api/telemetry");
      const json = await res.json();
      if (json.telemetry && json.telemetry.length > 0) {
        const points = json.telemetry.map((t: { created_at: string; metadata: { cpu: string; interactions: string } }) => ({
          time: new Date(t.created_at),
          load: Number(t.metadata.cpu?.replace('%', '')) || 0,
          interactions: Number(t.metadata.interactions) || 0
        }));
        setData(points);

        // Calculate real-time stats
        const avgLoad = Math.round(points.reduce((acc: number, p: DataPoint) => acc + p.load, 0) / points.length);
        const totalInteractions = points.reduce((acc: number, p: DataPoint) => acc + p.interactions, 0);
        setStats(prev => ({
          ...prev,
          meanLoad: `${avgLoad}%`,
          interactions: totalInteractions.toLocaleString()
        }));
      }
    } catch (err) {
      console.error("Telemetry fetch failed:", err);
    }
  };

  // Poll live telemetry
  useEffect(() => {
    (async () => {
      await fetchTelemetry();
    })();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length < 2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.time) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(-height + margin.top + margin.bottom).tickFormat(() => ""))
      .attr("stroke", "#ffffff05");

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .attr("stroke", "#ffffff05");

    // Line for Load
    const loadLine = d3.line<DataPoint>()
      .x(d => x(d.time))
      .y(d => y(d.load))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", loadLine)
      .attr("filter", "drop-shadow(0 0 5px rgba(239, 68, 68, 0.5))");

    // Line for Interactions
    const interactionLine = d3.line<DataPoint>()
      .x(d => x(d.time))
      .y(d => y(d.interactions))
      .curve(d3.curveStep);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f97316")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4")
      .attr("d", interactionLine)
      .attr("filter", "drop-shadow(0 0 5px rgba(249, 115, 22, 0.5))");

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(10))
      .attr("color", "#52525b")
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "8px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10))
      .attr("color", "#52525b")
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "8px");

  }, [data]);

  return (
    <div className="card p-6 bg-zinc-950/80 border-orange-500/10 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-none border border-orange-500/20 flex items-center justify-center text-orange-500 animate-flicker">
            📡
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white font-mono">Agent_Fleet_Telemetry</h2>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Real-time neural load analysis</p>
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Uptime</div>
            <div className="text-lg font-black text-white font-mono tabular-nums tracking-tighter">{stats.uptime}</div>
          </div>
          <div>
            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Mean_Load</div>
            <div className="text-lg font-black text-orange-500 font-mono tabular-nums tracking-tighter">{stats.meanLoad}</div>
          </div>
          <div>
            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Interactions</div>
            <div className="text-lg font-black text-white font-mono tabular-nums tracking-tighter">{stats.interactions}</div>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full relative">
        <svg ref={svgRef} className="w-full h-full" />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Task_Load</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 border-t border-dashed border-orange-500" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Interactions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

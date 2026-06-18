"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { AGENTS as REAL_AGENTS } from "@/lib/agents";
import {
  Terminal,
  Mic,
  Camera,
  Send,
  Bot,
  Activity,
  StopCircle,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "system" | "user" | "agent" | "error" | "success";
  text: string;
  agentName?: string;
}

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function JarvisTerminal() {
  const { resolvedColors: T } = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("director");
  const [stats, setStats] = useState({ cpu: 12, mem: 4.2 });
  const terminalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* Auto-scroll terminal */
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, isProcessing]);

  /* Boot sequence */
  useEffect(() => {
    const bootLogs: LogEntry[] = [
      {
        id: "b1",
        timestamp: getTimestamp(),
        type: "system",
        text: "Initializing LiTTree Core v2.4...",
      },
      {
        id: "b2",
        timestamp: getTimestamp(),
        type: "system",
        text: "Connecting to Agent Cluster...",
      },
      {
        id: "b3",
        timestamp: getTimestamp(),
        type: "success",
        text: "Connection established. TLS 1.3 verified.",
      },
    ];

    Object.values(REAL_AGENTS).forEach((agent, i) => {
      bootLogs.push({
        id: `b-agent-${i}`,
        timestamp: getTimestamp(),
        type: "agent",
        text: `${agent.name} ready — ${agent.role} [${agent.status.toUpperCase()}]`,
        agentName: agent.name,
      });
    });

    bootLogs.push({
      id: "b-welcome",
      timestamp: getTimestamp(),
      type: "system",
      text: `System nominal. ${
        Object.values(REAL_AGENTS).filter((a) => a.status === "online").length
      } agents online. Awaiting command.`,
    });

    setLogs(bootLogs);
  }, []);

  /* Simulated stats ticker */
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((s) => ({
        cpu: Math.min(100, Math.max(5, s.cpu + (Math.random() - 0.5) * 14)),
        mem: Math.min(16, Math.max(2, s.mem + (Math.random() - 0.5) * 0.6)),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const addLog = useCallback((entry: Omit<LogEntry, "id" | "timestamp">) => {
    setLogs((prev) => [
      ...prev,
      {
        ...entry,
        id: Math.random().toString(36).slice(2, 9),
        timestamp: getTimestamp(),
      },
    ]);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isProcessing) return;
    const msg = input.trim();
    setInput("");
    addLog({ type: "user", text: msg });
    setIsProcessing(true);

    const agent = REAL_AGENTS[selectedAgent];
    addLog({
      type: "system",
      text: `Routing to ${agent?.name ?? "Director"}...`,
    });

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentSlug: selectedAgent,
          message: msg,
          provider: "gemini",
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      addLog({
        type: "agent",
        text: data.response || "No response received.",
        agentName: agent?.name || "Agent",
      });
    } catch (err) {
      addLog({
        type: "error",
        text:
          err instanceof Error ? err.message : "Request failed. Check API key.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, selectedAgent, addLog]);

  /* Voice recognition */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;
    rec.lang = "en-US";
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-send after a brief delay so the user sees what was captured
      setTimeout(() => {
        setInput((prev) => {
          if (prev === transcript) {
            // Trigger send via a separate effect would be cleaner,
            // but we'll let user press Enter or click Execute
          }
          return prev;
        });
      }, 200);
    };

    recognitionRef.current = rec;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      addLog({
        type: "error",
        text: "Voice API not supported in this browser.",
      });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        addLog({ type: "error", text: "Mic already active." });
      }
    }
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      streamRef.current = null;
      setCameraOn(false);
      addLog({ type: "system", text: "Camera feed terminated." });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraOn(true);
        addLog({
          type: "success",
          text: "Visual sensors online. Ready for scan/analysis.",
        });
      } catch {
        addLog({ type: "error", text: "Camera access denied or unavailable." });
      }
    }
  };

  const agentList = Object.values(REAL_AGENTS);
  const onlineCount = agentList.filter((a) => a.status === "online").length;

  return (
    <div className="flex flex-col h-full gap-3 min-h-[500px]">
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg border"
        style={{
          backgroundColor: `${T.boxBg}90`,
          borderColor: `${T.borderColor}25`,
        }}
      >
        <div className="flex items-center gap-3">
          <Terminal size={16} style={{ color: T.accentColor }} />
          <span
            className="text-xs font-mono uppercase tracking-widest font-bold"
            style={{ color: T.accentColor }}
          >
            JARVIS
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: T.success }}
          />
          <span
            className="text-[10px] font-mono uppercase"
            style={{ color: T.success }}
          >
            ONLINE
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <Activity size={10} style={{ color: T.headerColor }} />
            <span className="opacity-50">CPU</span>
            <span style={{ color: T.headerColor }}>
              {stats.cpu.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="opacity-50">MEM</span>
            <span style={{ color: T.headerColor }}>
              {stats.mem.toFixed(1)} GB
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bot size={10} style={{ color: T.success }} />
            <span style={{ color: T.success }}>{onlineCount} ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Terminal column */}
        <div className="flex-1 flex flex-col min-w-0 gap-3">
          {/* Terminal output */}
          <div
            ref={terminalRef}
            className="relative scanlines flex-1 rounded-lg border p-3 overflow-y-auto font-mono text-xs space-y-1 min-h-0"
            style={{
              backgroundColor: `${T.boxBg}50`,
              borderColor: `${T.borderColor}20`,
            }}
          >
            {logs.map((log) => (
              <div key={log.id} className="break-words leading-relaxed">
                <span className="opacity-30 mr-1.5">[{log.timestamp}]</span>
                {log.type === "user" && (
                  <span className="font-bold" style={{ color: T.textColor }}>
                    <span style={{ color: T.accentColor }}>&gt;</span>{" "}
                    {log.text}
                  </span>
                )}
                {log.type === "agent" && (
                  <>
                    <span
                      className="font-bold mr-1"
                      style={{ color: T.linkColor }}
                    >
                      [{log.agentName}]
                    </span>
                    <span style={{ color: T.textMuted }}>{log.text}</span>
                  </>
                )}
                {log.type === "system" && (
                  <span style={{ color: T.textMuted }}>
                    <span className="opacity-50">[SYS]</span> {log.text}
                  </span>
                )}
                {log.type === "success" && (
                  <span style={{ color: T.success }}>
                    <span className="opacity-70">[OK]</span> {log.text}
                  </span>
                )}
                {log.type === "error" && (
                  <span style={{ color: T.accentColor }}>
                    <span className="opacity-70">[ERR]</span> {log.text}
                  </span>
                )}
              </div>
            ))}

            {isProcessing && (
              <div
                className="flex items-center gap-2 animate-pulse"
                style={{ color: T.textMuted }}
              >
                <Activity size={12} className="animate-spin" />
                <span>Processing request...</span>
              </div>
            )}
          </div>

          {/* Input area */}
          <div
            className="rounded-lg border p-3 flex flex-col gap-2 shrink-0"
            style={{
              backgroundColor: `${T.boxBg}80`,
              borderColor: `${T.borderColor}20`,
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-wider opacity-40 font-mono">
                Command Input
              </span>
              <div className="flex gap-2">
                <button
                  onClick={toggleCamera}
                  className="text-[10px] border px-2 py-1 rounded transition-all flex items-center gap-1"
                  style={{
                    borderColor: cameraOn
                      ? T.accentColor
                      : `${T.borderColor}50`,
                    color: cameraOn ? T.accentColor : T.textMuted,
                    backgroundColor: cameraOn
                      ? `${T.accentColor}10`
                      : "transparent",
                  }}
                >
                  <Camera size={10} />
                  CAM:{cameraOn ? "ON" : "OFF"}
                </button>
                <button
                  onClick={toggleMic}
                  className="text-[10px] border px-2 py-1 rounded transition-all flex items-center gap-1"
                  style={{
                    borderColor: isListening
                      ? T.accentColor
                      : `${T.borderColor}50`,
                    color: isListening ? T.accentColor : T.textMuted,
                    backgroundColor: isListening
                      ? `${T.accentColor}10`
                      : "transparent",
                  }}
                >
                  {isListening ? <StopCircle size={10} /> : <Mic size={10} />}
                  {isListening ? "LISTENING..." : "VOICE"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="font-mono text-sm select-none"
                style={{ color: T.accentColor }}
              >
                &gt;
              </span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type command or speak..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-mono placeholder:opacity-30 min-w-0"
                style={{ color: T.textColor }}
                disabled={isProcessing}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isProcessing}
                className="px-4 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-30 flex items-center gap-1.5 shrink-0"
                style={{
                  backgroundColor: T.accentColor,
                  color: "#000",
                }}
              >
                <Send size={12} />
                EXECUTE
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar — agents + camera */}
        <div className="hidden lg:flex w-64 flex-col gap-3 shrink-0">
          {/* Camera feed */}
          <div
            className="h-36 rounded-lg border relative overflow-hidden"
            style={{
              backgroundColor: `${T.boxBg}60`,
              borderColor: `${T.borderColor}20`,
            }}
          >
            {cameraOn && (
              <span
                className="absolute top-2 left-2 text-[9px] z-10 px-1.5 py-0.5 rounded font-mono"
                style={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: T.accentColor,
                }}
              >
                LIVE FEED
              </span>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ opacity: cameraOn ? 0.8 : 0 }}
            />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Camera size={28} style={{ color: T.textMuted }} />
              </div>
            )}
            {/* Crosshair overlay */}
            {cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <div
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                  style={{ borderColor: T.accentColor }}
                >
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: T.accentColor }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Agent selector */}
          <div
            className="flex-1 rounded-lg border p-3 overflow-y-auto min-h-0"
            style={{
              backgroundColor: `${T.boxBg}60`,
              borderColor: `${T.borderColor}20`,
            }}
          >
            <div
              className="text-[10px] uppercase tracking-wider opacity-40 mb-3 border-b pb-2 font-mono"
              style={{ borderColor: `${T.borderColor}30` }}
            >
              Active Agents
            </div>
            <div className="space-y-1.5">
              {agentList.map((agent) => {
                const isActive = selectedAgent === agent.id;
                const statusColor =
                  agent.status === "online"
                    ? T.success
                    : agent.status === "busy"
                      ? "#f59e0b"
                      : T.textMuted;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-md transition-all text-left"
                    style={{
                      backgroundColor: isActive
                        ? `${T.accentColor}12`
                        : "transparent",
                      border: `1px solid ${
                        isActive ? `${T.accentColor}35` : "transparent"
                      }`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                      }}
                    >
                      <Bot size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-bold truncate"
                        style={{ color: T.textColor }}
                      >
                        {agent.name}
                      </div>
                      <div className="text-[10px] opacity-50 truncate">
                        {agent.role}
                      </div>
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        agent.status === "online" ? "animate-pulse" : ""
                      }`}
                      style={{ backgroundColor: statusColor }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

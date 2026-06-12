"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

// ─── Agents that can generate worlds ──────────────────────────────────────────
const WORLD_AGENTS = [
  { id: "pixel-forge", name: "Pixel Forge", icon: "🎨", color: "#e74c3c", desc: "AI image and 3D world generation specialist" },
  { id: "director", name: "Director", icon: "🎯", color: "#00ffff", desc: "Orchestrates creative vision and world-building strategy" },
  { id: "champion", name: "Champion", icon: "🏆", color: "#ff0080", desc: "General creative partner for any visual concept" },
];

const CORE_AGENTS = [
  { id: "director", name: "Director", icon: "🎯", color: "#00ffff", desc: "System Orchestrator" },
  { id: "champion", name: "Champion", icon: "🏆", color: "#00ff41", desc: "General Assistant" },
  { id: "code-champion", name: "Code Champion", icon: "💻", color: "#ff0080", desc: "Software Architect" },
  { id: "social-dominator", name: "Social Dominator", icon: "📱", color: "#ff6b35", desc: "Growth Marketer" },
  { id: "data-slayer", name: "Data Slayer", icon: "📊", color: "#a855f7", desc: "Analytics Engineer" },
  { id: "writing-coach", name: "Writing Coach", icon: "✍️", color: "#f472b6", desc: "Content Publisher" },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentId: string;
  ts: string;
  worldUrl?: string;
  thumbUrl?: string;
  status?: string;
};

type GeneratedWorld = {
  id: string;
  prompt: string;
  fileUrl?: string;
  thumbUrl?: string;
  status: string;
  createdAt: string;
};

export default function AgentChat() {
  const { resolvedColors: T } = useTheme();
  const [selectedAgent, setSelectedAgent] = useState(CORE_AGENTS[1]); // Default to Champion
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [worlds, setWorlds] = useState<GeneratedWorld[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "forge" | "gallery">("chat");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [crtEnabled, setCrtEnabled] = useState(true);

  useEffect(() => {
    // Check local storage for persistent CRT configuration
    const val = localStorage.getItem("crt_global_scanlines");
    if (val !== null) {
      setCrtEnabled(val === "true");
    }
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const generateWorld = useCallback(async (prompt: string) => {
    const res = await fetch("/api/skybox/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, negativePrompt: "blurry, low quality, distorted" }),
    });
    const data = await res.json();
    if (data.success) {
      return { id: data.id, status: data.status, fileUrl: data.fileUrl, thumbUrl: data.thumbUrl };
    }
    throw new Error(data.error || "Skybox generation failed");
  }, []);

  const pollWorld = useCallback(async (id: string) => {
    const res = await fetch(`/api/skybox/poll/${id}`);
    const data = await res.json();
    if (data.success) {
      return { status: data.status, fileUrl: data.fileUrl, thumbUrl: data.thumbUrl };
    }
    return null;
  }, []);

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    setInput("");
    setIsLoading(true);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      agentId: selectedAgent.id,
      ts: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Check if in Forge mode or using world generation keywords in Chat mode
    const isForgeMode = activeTab === "forge";
    const wantsWorld = isForgeMode || /\b(generate|create|make|build|skybox|world|scene|environment|360)\b/i.test(content);

    if (wantsWorld) {
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `🌍 ${selectedAgent.name} is generating your world: "${content}"...`,
        agentId: selectedAgent.id,
        ts: new Date().toLocaleTimeString(),
        status: "generating",
      };
      setMessages(prev => [...prev, assistantMsg]);

      try {
        const world = await generateWorld(content);
        // ... rest of generation logic ...
        const newWorld: GeneratedWorld = { id: world.id, prompt: content, status: world.status, createdAt: new Date().toISOString(), fileUrl: world.fileUrl, thumbUrl: world.thumbUrl };
        setWorlds(prev => [newWorld, ...prev]);

        // Poll for completion
        let completed = world.status === 2;
        let attempts = 0;
        let currentWorld = world;
        while (!completed && attempts < 30) {
          await new Promise(r => setTimeout(r, 3000));
          const poll = await pollWorld(world.id);
          if (poll) {
            currentWorld = { ...currentWorld, status: poll.status, fileUrl: poll.fileUrl, thumbUrl: poll.thumbUrl };
            completed = poll.status === 2;
          }
          attempts++;
        }

        setWorlds(prev => prev.map(w => w.id === world.id ? { ...w, status: currentWorld.status, fileUrl: currentWorld.fileUrl, thumbUrl: currentWorld.thumbUrl } : w));

        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? {
          ...m,
          content: completed ? `✅ World generated!` : `⏳ World is still processing. Check the Gallery tab.`,
          worldUrl: currentWorld.fileUrl,
          thumbUrl: currentWorld.thumbUrl,
          status: completed ? "done" : "pending",
        } : m));
      } catch (err) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `❌ Generation failed: ${err instanceof Error ? err.message : "Unknown error"}.`,
          agentId: selectedAgent.id,
          ts: new Date().toLocaleTimeString(),
        }]);
      }
    } else {
      // Regular Neural Chat response via Gemini Streaming
      try {
        const assistantMsgId = crypto.randomUUID();
        const assistantMsg: Message = {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          agentId: selectedAgent.id,
          ts: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, assistantMsg]);

        const res = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].slice(-10).map(m => ({ role: m.role, content: m.content })),
            systemPrompt: `You are ${selectedAgent.name}, ${selectedAgent.desc}. Be concise, helpful, and stay in character.`,
            stream: true,
          }),
        });

        if (!res.body) throw new Error("No response body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulated += chunk;
          setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulated } : m));
        }
      } catch (err) {
        console.error("Chat error:", err);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "⚠️ Connection to neural core lost. Attempting to reconnect...",
          agentId: selectedAgent.id,
          ts: new Date().toLocaleTimeString(),
        }]);
      }
    }

    setIsLoading(false);
  }, [input, isLoading, selectedAgent, messages, activeTab, generateWorld, pollWorld]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", display: "flex", flexDirection: "column", color: T.textColor, fontFamily: "monospace", position: "relative" }}>
      {/* CRT Scanline Filter */}
      {crtEnabled && (
        <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.06]" style={{
          background: "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px)",
          boxShadow: "inset 0 0 80px rgba(0, 255, 0, 0.3)"
        }} />
      )}
      {/* Top Nav */}
      <nav style={{ backgroundColor: T.boxBg, borderBottom: `2px solid ${T.borderColor}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Link href="/" style={{ textDecoration: "none", color: T.headerColor, fontWeight: "bold", fontSize: "14px", letterSpacing: "2px" }}>⚡ LITLABS</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: T.accentColor, fontSize: "10px" }}>● ONLINE</span>
          <button onClick={() => { setActiveTab("chat"); setSelectedAgent(CORE_AGENTS[0]); }} style={{ backgroundColor: "transparent", border: "none", color: activeTab === "chat" ? T.accentColor : T.textColor, cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>💬 Neural Chat</button>
          <button onClick={() => { setActiveTab("forge"); setSelectedAgent(WORLD_AGENTS[0]); }} style={{ backgroundColor: "transparent", border: "none", color: activeTab === "forge" ? T.accentColor : T.textColor, cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>🌍 World Forge</button>
          <button onClick={() => setActiveTab("gallery")} style={{ backgroundColor: "transparent", border: "none", color: activeTab === "gallery" ? T.accentColor : T.textColor, cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>🖼️ Gallery ({worlds.length})</button>
        </div>
      </nav>

      {activeTab !== "gallery" ? (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left Sidebar - Agents */}
          <div style={{ width: "220px", flexShrink: 0, backgroundColor: T.boxBg, borderRight: `2px solid ${T.borderColor}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <div style={{ padding: "12px", borderBottom: `1px solid ${T.borderColor}` }}>
              <div style={{ color: T.accentColor, fontSize: "9px", letterSpacing: "1px", marginBottom: "6px" }}>{activeTab === "chat" ? "CORE AGENTS" : "WORLD BUILDERS"}</div>
              {(activeTab === "chat" ? CORE_AGENTS : WORLD_AGENTS).map(a => (
                <button key={a.id} onClick={() => setSelectedAgent(a)} style={{ width: "100%", textAlign: "left", padding: "8px", marginBottom: "3px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", border: "none", backgroundColor: selectedAgent.id === a.id ? `${a.color}20` : "transparent", borderLeft: selectedAgent.id === a.id ? `3px solid ${a.color}` : "3px solid transparent", transition: "all 0.15s" }}>
                  <span style={{ fontSize: "18px" }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: selectedAgent.id === a.id ? a.color : T.headerColor, fontSize: "11px", fontWeight: "bold" }}>{a.name}</div>
                    <div style={{ color: T.textColor, fontSize: "9px", opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "auto", padding: "12px", borderTop: `1px solid ${T.borderColor}` }}>
              <div style={{ color: T.accentColor, fontSize: "9px", letterSpacing: "1px", marginBottom: "6px" }}>QUICK PROMPTS</div>
              {[
                "A cyberpunk city at night with neon lights",
                "An ancient temple hidden in a jungle",
                "A futuristic space station orbiting a gas giant",
                "A serene Japanese garden with cherry blossoms",
                "A post-apocalyptic wasteland with ruins",
              ].map(p => (
                <button key={p} onClick={() => { setInput(p); }} style={{ width: "100%", textAlign: "left", padding: "5px 4px", marginBottom: "2px", backgroundColor: "transparent", border: "none", color: T.linkColor, cursor: "pointer", fontSize: "10px", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={p}>
                  ⚡ {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {/* Header */}
            <div style={{ backgroundColor: T.boxBg, borderBottom: `2px solid ${T.borderColor}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
              <span style={{ fontSize: "22px" }}>{selectedAgent.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: selectedAgent.color, fontSize: "13px", fontWeight: "bold" }}>{selectedAgent.name}</div>
                <div style={{ color: T.textColor, fontSize: "10px", opacity: 0.7 }}>{selectedAgent.desc}</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: "40px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>{selectedAgent.icon}</div>
                  <div style={{ color: selectedAgent.color, fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>{selectedAgent.name}</div>
                  <div style={{ color: T.textColor, fontSize: "12px", maxWidth: "400px", margin: "0 auto 24px", lineHeight: 1.6 }}>
                    {activeTab === "forge" 
                      ? "Describe a world and I will generate it as a 360° panoramic image." 
                      : `I am ${selectedAgent.name}. How can I assist you in the Hive Mind today?`}
                    <br/><br/>
                    {activeTab === "forge" && <em style={{ color: T.linkColor }}>&quot;A futuristic cyberpunk city at night with neon lights and flying cars&quot;</em>}
                  </div>
                </div>
              )}

              {messages.map(msg => {
                const author = [...CORE_AGENTS, ...WORLD_AGENTS].find(a => a.id === msg.agentId);
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "80%", padding: "10px 14px", backgroundColor: msg.role === "user" ? "rgba(0,255,65,0.08)" : "rgba(255,0,128,0.08)", border: `1px solid ${msg.role === "user" ? T.textColor : T.linkColor}` }}>
                      <div style={{ fontSize: "9px", color: msg.role === "user" ? T.textColor : T.linkColor, fontWeight: "bold", marginBottom: "5px" }}>
                        {msg.role === "user" ? `▶ You` : `${author?.icon || "🤖"} ${author?.name || "Agent"}`} · {msg.ts}
                      </div>
                      <div style={{ color: "#e0e0e0", fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                      {msg.worldUrl && (
                        <div style={{ marginTop: "10px" }}>
                          <Image src={msg.thumbUrl || msg.worldUrl} alt="Generated world" width={400} height={200} style={{ border: `1px solid ${T.borderColor}`, maxWidth: "100%", height: "auto" }} unoptimized />
                          <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
                            <a href={msg.worldUrl} target="_blank" rel="noopener noreferrer" style={{ color: T.linkColor, fontSize: "11px" }}>🔗 Open Full Image</a>
                            <Link href="/gallery" style={{ color: T.accentColor, fontSize: "11px" }}>🖼️ View in Gallery</Link>
                          </div>
                        </div>
                      )}
                      {msg.status === "generating" && (
                        <div style={{ marginTop: "8px", color: T.accentColor, fontSize: "11px" }}>⏳ Generating 360° world...</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && messages[messages.length - 1]?.status !== "generating" && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ padding: "10px 14px", border: `1px solid ${T.linkColor}`, color: T.linkColor, fontSize: "11px" }}>
                    {selectedAgent.icon} {selectedAgent.name} is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: `2px solid ${T.borderColor}`, backgroundColor: T.boxBg, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder={activeTab === "forge" ? `Describe a world for ${selectedAgent.name} to generate...` : `Message ${selectedAgent.name}...`} rows={1} disabled={isLoading} style={{ flex: 1, padding: "10px 12px", backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}`, color: "#e0e0e0", fontSize: "13px", resize: "none", minHeight: "42px", maxHeight: "120px", fontFamily: "monospace", outline: "none" }} />
                <button onClick={sendMessage} disabled={!input.trim() || isLoading} style={{ padding: "0 20px", backgroundColor: input.trim() && !isLoading ? T.linkColor : "#2a1a2e", color: "white", border: "none", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed", fontWeight: "bold", fontSize: "16px", flexShrink: 0 }}>➤</button>
              </div>
              <div style={{ color: T.textColor, fontSize: "9px", marginTop: "5px", opacity: 0.5 }}>Powered by Gemini · {activeTab === "forge" ? "Skybox 360°" : "Hive Mind Neural Core"} · Shift+Enter for new line</div>
            </div>
          </div>
        </div>
      ) : (
        /* Gallery Tab */
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ color: T.accentColor, fontSize: "11px", letterSpacing: "2px", marginBottom: "16px", fontWeight: "bold" }}>🖼️ GENERATED WORLDS ({worlds.length})</div>
          {worlds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: T.textColor, opacity: 0.5 }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌍</div>
              <div>No worlds generated yet. Go to Chat and describe a scene!</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {worlds.map(world => (
                <div key={world.id} style={{ border: `1px solid ${T.borderColor}`, backgroundColor: "rgba(0,0,0,0.3)", overflow: "hidden" }}>
                  <div style={{ position: "relative", width: "100%", height: "180px" }}>
                    {world.thumbUrl || world.fileUrl ? (
                      <Image src={world.thumbUrl || world.fileUrl!} alt={world.prompt} fill style={{ objectFit: "cover" }} sizes="300px" unoptimized />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textColor, opacity: 0.5 }}>⏳ Generating...</div>
                    )}
                    {world.status !== "2" && (
                      <div style={{ position: "absolute", top: "8px", right: "8px", padding: "4px 8px", backgroundColor: "rgba(0,0,0,0.7)", color: T.accentColor, fontSize: "9px" }}>Processing</div>
                    )}
                  </div>
                  <div style={{ padding: "12px" }}>
                    <div style={{ color: T.headerColor, fontSize: "12px", fontWeight: "bold", marginBottom: "4px", lineHeight: 1.4 }}>{world.prompt}</div>
                    <div style={{ color: T.textColor, fontSize: "9px", opacity: 0.6 }}>{new Date(world.createdAt).toLocaleString()}</div>
                    {world.fileUrl && (
                      <a href={world.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: T.linkColor, fontSize: "10px", marginTop: "8px", display: "inline-block" }}>🔗 Open Full Image</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bgColor}; }
        ::-webkit-scrollbar-thumb { background: ${T.borderColor}; }
        textarea:focus { border-color: ${T.linkColor} !important; }
      `}</style>
    </div>
  );
}

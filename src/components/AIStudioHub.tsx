"use client";
import React, { useState } from 'react';

// Custom Safe Copy utility for iframe environments
const copyToClipboard = (text: string) => {
  const textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  try {
    document.execCommand('copy');
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  } finally {
    textField.remove();
  }
};

interface Preset {
  name: string;
  system: string;
  prompt: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: string;
}

interface GeminiPart {
  text: string;
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export default function AIStudioHub() {
  const [apiKey, setApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an expert Frontend Engineer. Generate clean, modular, modern HTML/JS pages using Tailwind CSS. Return ONLY the code inside a single complete, valid file. Do not wrap code in markdown formatting, start directly with the document tag or valid React code."
  );
  const [userPrompt, setUserPrompt] = useState(
    "Build a gorgeous dashboard for a smart home energy monitor with graphs, status cards, and responsive controls."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [responseCode, setResponseCode] = useState('');
  const [previewTab, setPreviewTab] = useState('preview'); // 'preview' | 'code' | 'logs'
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const presets: Preset[] = [
    {
      name: "React Tailwind Component",
      system: "Act as a senior React developer. Write a premium, self-contained interactive React component using Tailwind CSS classes. Use inline SVGs for all icons. Export default component named App. No external assets.",
      prompt: "Create a rich multi-stage wizard component for onboarding new developers to an AI cluster project, with step validations and nice animations."
    },
    {
      name: "Single Page App (Tailwind HTML)",
      system: "Act as an elite Creative Web Designer. Create a complete standalone HTML page using Tailwind CSS CDN, fully responsive, visually breath-taking, with dark futuristic theme, subtle glowing animations, and dummy interactions using vanilla JS.",
      prompt: "Develop a landing page for 'HiveMind AI' - an autonomous agent fleet. Include an interactive agent flow layout and pricing calculator."
    },
    {
      name: "Markdown Tech Spec Writer",
      system: "Act as a Principal System Architect. Write a comprehensive technical design document with architectural blueprints, API definitions, data schemas, and integration strategies.",
      prompt: "Draft an architecture spec for connecting a local WSL2 environment to an external headless Cloudflare tunnel with multiple port-forward networks."
    }
  ];
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(-1);

  // Add message to internal logs console
  const addLog = (message: string, type = 'info') => {
    setLogs((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  const showToast = (msg: string, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  // Exponential Backoff API Fetcher
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 5, delay = 1000): Promise<GeminiResponse> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
      }
      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (retries > 0) {
        addLog(`Request failed. Retrying in ${delay / 1000}s... (${retries} retries left)`, 'warn');
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw new Error(message);
    }
  };

  const triggerGeneration = async () => {
    if (!apiKey) {
      showToast("⚠ Please provide a Google AI Studio API Key first.");
      addLog("Generation blocked: Missing Gemini API Key", "error");
      return;
    }

    setIsLoading(true);
    addLog("Initiating generation request with gemini-2.5-flash...", "info");
    setPreviewTab('code');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [{ text: userPrompt }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: parseFloat(temperature.toString()),
        maxOutputTokens: 8192
      }
    };

    try {
      const result = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const extractedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (extractedText) {
        // Clean markdown backticks if any
        let cleanCode = extractedText;
        if (cleanCode.startsWith('```')) {
          cleanCode = cleanCode.replace(/^```[a-zA-Z]*\n/, '');
          cleanCode = cleanCode.replace(/\n```$/, '');
        }
        setResponseCode(cleanCode);
        addLog("Generation completed successfully!", "success");
        setPreviewTab('preview');
        showToast("✨ Page built successfully!");
      } else {
        throw new Error("API response did not return any parseable content parts.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      addLog(`Generation Failed: ${message}`, "error");
      showToast("❌ Generation failed. Check terminal logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (index: number) => {
    const preset = presets[index];
    setSystemPrompt(preset.system);
    setUserPrompt(preset.prompt);
    setSelectedPresetIndex(index);
    addLog(`Loaded preset configuration: "${preset.name}"`, "info");
    showToast(`Loaded ${preset.name}`);
  };

  const [targetFilePath, setTargetFilePath] = useState('src/app/(dashboard)/new-feature/page.tsx');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToProject = async () => {
    if (!responseCode) return;
    if (!targetFilePath.startsWith('src/app/') && !targetFilePath.startsWith('src/components/')) {
      showToast("❌ Path must start with src/app/ or src/components/");
      return;
    }

    setIsSaving(true);
    addLog(`Attempting to write to ${targetFilePath}...`, "info");

    try {
      const res = await fetch("/api/agents/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: targetFilePath, content: responseCode })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save file");
      
      showToast("💾 Saved directly to project!");
      addLog(`Success: Overwrote ${targetFilePath} with new generation.`, "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showToast("❌ Failed to save. Check logs.");
      addLog(`Save Error: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCode = () => {
    if (!responseCode) return;
    const success = copyToClipboard(responseCode);
    if (success) {
      showToast("📋 Code copied to clipboard!");
      addLog("Copied generated code block to clipboard.", "success");
    } else {
      showToast("❌ Failed to copy automatically.");
    }
  };

  // Safe Iframe Sandbox Generator
  const getIframeSrcDoc = () => {
    if (!responseCode) {
      return `
        <html>
          <body style="background: #090d16; color: #4b5563; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; border: 1px dashed #1e293b; border-radius: 12px;">
            <div>
              <p style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 8px;">Workspace Canvas Ready</p>
              <p style="font-size: 0.85rem; max-width: 320px;">Use the controls on the left to prompt Gemini and watch your UI generate here live.</p>
            </div>
          </body>
        </html>
      `;
    }

    // Direct check if generated code is React or plain HTML
    if (responseCode.includes('import React') || responseCode.includes('export default') || responseCode.includes('useState')) {
      return `
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          </head>
          <body class="bg-slate-950 text-slate-100 min-h-screen">
            <div id="root"></div>
            <script type="text/babel">
              // Clean imports from generated code to avoid run-time crash in iframe
              let code = \`${responseCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
              code = code.replace(/import\\s+.*?\\s+from\\s+['\"].*?['\"];?/g, '');
              code = code.replace(/export\\s+default\\s+/g, '');
              
              try {
                // Evaluate code to declare App component
                eval(code);
                const RootApp = typeof App !== 'undefined' ? App : () => (
                  <div class="p-8 text-center text-red-400">
                    <p class="font-bold">Execution Error</p>
                    <p class="text-sm">No 'App' component was resolved from code execution.</p>
                  </div>
                );
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<RootApp />);
              } catch (e) {
                document.getElementById('root').innerHTML = \`
                  <div class="p-8 m-4 bg-red-950/20 border border-red-500/30 rounded-xl text-red-400">
                    <h3 class="font-bold text-lg mb-2">React Mount Failed</h3>
                    <p class="text-sm font-mono bg-black/40 p-3 rounded border border-red-900/40">\${e.message}</p>
                  </div>
                \`;
              }
            </script>
          </body>
        </html>
      `;
    }

    // Return standard raw HTML payload with modern Tailwind support
    return responseCode;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 antialiased font-sans rounded-2xl overflow-hidden border border-white/10">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500 text-indigo-300 shadow-2xl shadow-indigo-500/20 px-4 py-3 rounded-xl flex items-center gap-3 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="flex-grow p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-auto">
        
        {/* LEFT COLUMN: CONTROL SUITE (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Presets Card */}
          <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              Select Engine Presets
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition duration-200 ${
                    selectedPresetIndex === idx
                      ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">{p.prompt}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Model Params & Key Setup */}
          <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Google AI Studio API Key</label>
              <input
                type="password"
                placeholder="Enter Gemini API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Temperature</span>
                <span className="text-indigo-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </section>

          {/* Prompt Writing Studio */}
          <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex-grow flex flex-col gap-4">
            <div className="flex-grow flex flex-col gap-3">
              <div className="flex-1 flex flex-col">
                <label className="block text-xs text-slate-400 font-semibold mb-1">System Instructions</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full flex-grow min-h-[100px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono leading-relaxed"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-xs text-slate-400 font-semibold mb-1">Creative User Query</label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full flex-grow min-h-[120px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                  placeholder="Describe your Next.js page..."
                />
              </div>
            </div>

            <button
              onClick={triggerGeneration}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:scale-[1.01]'
              }`}
            >
              {isLoading ? "Forging UI..." : "Generate & Stream Design"}
            </button>
          </section>
        </div>

        {/* RIGHT COLUMN: PREVIEW & CODE MONITOR (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-5 min-h-[500px]">
          
          {/* Header Action Menu & Tabs */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-xl flex-wrap gap-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['preview', 'code', 'logs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPreviewTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition capitalize ${
                    previewTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={targetFilePath}
                onChange={(e) => setTargetFilePath(e.target.value)}
                placeholder="src/app/..."
                className="bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
              />
              <button
                onClick={handleSaveToProject}
                disabled={!responseCode || isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Deploy to Disk"}
              </button>
              <button
                onClick={handleCopyCode}
                disabled={!responseCode}
                className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Copy Code
              </button>
            </div>
          </div>

          {/* Tab Viewer Area */}
          <div className="flex-grow bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {previewTab === 'preview' && (
              <iframe
                title="Canvas Preview"
                srcDoc={getIframeSrcDoc()}
                sandbox="allow-scripts"
                className="w-full h-full border-0 bg-white"
              />
            )}
            {previewTab === 'code' && (
              <pre className="p-5 font-mono text-xs text-slate-300 overflow-auto whitespace-pre leading-relaxed h-full">
                {responseCode || "Generate some code..."}
              </pre>
            )}
            {previewTab === 'logs' && (
              <div className="p-5 font-mono text-xs overflow-auto flex flex-col gap-2 h-full">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-b border-slate-800 pb-1.5">
                    <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

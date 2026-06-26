"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EmulatorJS-powered game emulator.
 * Supports: NES, SNES, Genesis/Mega Drive, Game Boy, GBA
 *
 * EmulatorJS loads entirely via CDN into a sandboxed iframe — no npm package.
 * ROMs are fetched from whatever URL is passed in (Supabase Storage, R2, etc.)
 *
 * EmulatorJS core map:
 *   nes      → nestopia
 *   snes     → snes9x
 *   genesis  → genesis_plus_gx
 *   gb       → gambatte
 *   gba      → mgba
 */

const CORE_MAP: Record<string, string> = {
  nes: "nestopia",
  snes: "snes9x",
  genesis: "genesis_plus_gx",
  gb: "gambatte",
  gba: "mgba",
};

interface GameEmulatorProps {
  romUrl: string;
  platform: "nes" | "snes" | "genesis" | "gb" | "gba" | "html5";
  title?: string;
  onError?: (error: string) => void;
}

export default function GameEmulator({
  romUrl,
  platform,
  title = "Game",
  onError,
}: GameEmulatorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const core = CORE_MAP[platform];

  // Validate ROM URL is reachable before starting the emulator
  useEffect(() => {
    if (!core) {
      const msg = `${platform.toUpperCase()} is not supported.`;
      setErrorMsg(msg);
      setStatus("error");
      onError?.(msg);
      return;
    }

    setStatus("loading");

    // Check the ROM is accessible
    fetch(romUrl, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) throw new Error(`ROM returned HTTP ${res.status}`);
        setStatus("ready");
      })
      .catch((err) => {
        const msg =
          err instanceof Error
            ? err.message
            : "ROM file not found or inaccessible.";
        setErrorMsg(
          `Could not load ROM: ${msg}\n\nUpload the ROM to your Supabase Storage bucket and set NEXT_PUBLIC_ROM_BASE_URL in your Vercel environment variables.`,
        );
        setStatus("error");
        onError?.(msg);
      });
  }, [romUrl, platform, core, onError]);

  if (status === "error" || !core) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400 text-sm font-bold mb-3">ROM Not Loaded</p>
          <p className="text-white/50 text-xs whitespace-pre-line leading-relaxed">
            {errorMsg}
          </p>
          <div className="mt-4 p-3 rounded border border-white/10 text-left">
            <p className="text-white/40 text-[10px] font-mono leading-relaxed">
              1. Go to Supabase Storage → create bucket &quot;roms&quot;
              <br />
              2. Upload your ROM file (e.g. smb1.nes)
              <br />
              3. Set
              NEXT_PUBLIC_ROM_BASE_URL=https://&lt;project&gt;.supabase.co/storage/v1/object/public/roms
              <br />
              4. Redeploy — the emulator will load automatically
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🎮</div>
          <p className="text-white/60 text-sm">Checking ROM...</p>
        </div>
      </div>
    );
  }

  // Build the EmulatorJS HTML that runs in the iframe
  // EmulatorJS CDN: https://cdn.emulatorjs.org/stable/data/
  const emulatorHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; width: 100vw; height: 100vh; overflow: hidden; }
  #game { width: 100%; height: 100%; }
</style>
</head>
<body>
<div id="game"></div>
<script>
  EJS_player = "#game";
  EJS_core = "${core}";
  EJS_gameUrl = ${JSON.stringify(romUrl)};
  EJS_gameID = ${JSON.stringify(title.replace(/[^a-z0-9]/gi, "_").toLowerCase())};
  EJS_color = "#ff00a0";
  EJS_startOnLoaded = true;
  EJS_fullscreenOnLoaded = false;
  EJS_Buttons = {
    saveState: true,
    loadState: true,
    fullscreen: true,
    screenshot: false,
    cacheManager: false,
  };
  EJS_language = "en-US";
  EJS_volume = 0.5;
  EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
</script>
<script src="https://cdn.emulatorjs.org/stable/data/loader.js"></script>
</body>
</html>`;

  const iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(emulatorHtml)}`;

  return (
    <div className="w-full h-full relative bg-black">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className="w-full h-full border-0"
        allow="autoplay; fullscreen; gamepad"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
        title={title}
      />
    </div>
  );
}

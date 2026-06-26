/**
 * /emulator — Bare-bones EmulatorJS bootstrap page.
 *
 * Loaded inside an iframe by GameEmulator.tsx via:
 *   /emulator?core=nestopia&rom=https://...&title=smb1
 *
 * Serving from a real URL (not data:) is required so the page can
 * load external scripts (cdn.emulatorjs.org) without CSP violations.
 * The Middleware and Clerk auth are bypassed for this route — it is
 * intentionally public and contains no sensitive data.
 */

export const dynamic = "force-dynamic";

export default function EmulatorPage({
  searchParams,
}: {
  searchParams: { core?: string; rom?: string; title?: string };
}) {
  const core = searchParams.core ?? "";
  const rom = searchParams.rom ?? "";
  const title = searchParams.title ?? "game";

  if (!core || !rom) {
    return (
      <html>
        <body style={{ background: "#000", color: "#fff", fontFamily: "monospace", padding: "2rem" }}>
          <p>Missing required params: core and rom</p>
        </body>
      </html>
    );
  }

  // Inline script sets EmulatorJS globals before loader.js runs.
  // Values are JSON-encoded so they are safe against injection.
  const config = JSON.stringify({
    EJS_player: "#game",
    EJS_core: core,
    EJS_gameUrl: rom,
    EJS_gameID: title.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
    EJS_color: "#ff00a0",
    EJS_startOnLoaded: true,
    EJS_fullscreenOnLoaded: false,
    EJS_Buttons: {
      saveState: true,
      loadState: true,
      fullscreen: true,
      screenshot: false,
      cacheManager: false,
    },
    EJS_language: "en-US",
    EJS_volume: 0.5,
    EJS_pathtodata: "https://cdn.emulatorjs.org/stable/data/",
  });

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * { margin: 0; padding: 0; box-sizing: border-box; }
              html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
              #game { width: 100%; height: 100%; }
            `,
          }}
        />
      </head>
      <body>
        <div id="game" />
<script
           dangerouslySetInnerHTML={{
             __html: `
               const cfg = ${config};
               Object.assign(window, cfg);
             `,
           }}
         />{/* eslint-disable-next-line @next/next/no-sync-scripts */}
         <script src="https://cdn.emulatorjs.org/stable/data/loader.js" />
      </body>
    </html>
  );
}

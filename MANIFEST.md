# LitLabs Architectural Manifest: Autonomic Loop Edition

This file maps the canonical architecture for the LitLabs Hive Mind. It ensures perfect consistency between Termux (Mobile), WSL (Development), and litlabs.net (Production).

## 1. Directory Structure
```text
/LiTTreeLabstudios/
├── bin/               # Autonomic workflow scripts (sync, save, dev, auto-fix)
├── tasks/             # Hive Mind Memory (backlog, active, completed)
├── prompts/           # Specialized Persona System Prompts (Director, Executor)
├── src/               # Next.js App Router & Core Logic
├── public/            # Static Assets & LLM context
└── GEMINI.md          # Core AI Directives
```

## 2. Network Infrastructure
- **Production:** [https://litlabs.net](https://litlabs.net)
- **API (WSL/Termux Tunnel):** [https://api.litlabs.net](https://api.litlabs.net)
- **Dev Live Reload:** [https://dev.litlabs.net](https://dev.litlabs.net)
- **Code Editor:** [https://code.litlabs.net](https://code.litlabs.net)

## 3. The Autonomic Loop
- **Sync:** `npm run sync` (Multi-device state synchronization)
- **Dev:** `npm run dev:loop` (Sync + Start local dev)
- **Save:** `npm run save "<message>"` (Lint + Typecheck + Commit + Push)
- **Auto-Fix:** `npm run auto-fix "<error>"` (Self-healing feedback loop)

---
*Maintained by the LitLabs Hive Mind.*

# LitLabs Core Directives (Autonomic Loop)

## Mandatory Workflow
All AI agents and developers operating in this repository MUST follow the Autonomic Loop.

1.  **Context Synchronization:** Run `npm run sync` before starting any task to ensure you have the latest code from both WSL and Termux environments.
2.  **Autonomous Task Tracking:** Check `tasks/active.json` for current project directives. 
    - The **Director** persona (`prompts/director.md`) plans work from `tasks/backlog/`.
    - The **Executor** persona (`prompts/executor.md`) implements code.
    - Completed tasks move to `tasks/completed/`.
3.  **Self-Correction:** If `npm run save` fails, the system runs `npm run auto-fix "<error_log>"` to feed errors back to the Executor.
4.  **The Gatekeeper:** NEVER commit using raw git commands. Use `npm run save "<message>"` for all commits. This script enforces ESLint and TypeScript compilation checks. If it fails, fix the code and retry.
5.  **Local Execution:** Use `npm run dev:loop` to start the development environment with an automatic sync.

## Hive Mind Personas
- **Director:** High-level planning. Sees the whole board.
- **Executor:** Code warrior. Obsessed with types and themes.
- **n8n/Gumloop:** The heartbeat. Orchestrates the handoffs and retries.

## Standards
- **TypeScript:** Strict typing is mandatory. Avoid `any` and `ts-ignore`.
- **Aesthetics:** Adhere to the "Volcanic Cyber" theme (Dark mode, deep oranges/blues, neon accents).
- **Communication:** Document your progress in the `tasks/` directory if completing a multi-stage autonomous loop.

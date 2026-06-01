# LitLabs Core Directives (Autonomic Loop)

## Mandatory Workflow
All AI agents and developers operating in this repository MUST follow the Autonomic Loop.

1.  **Context Synchronization:** Run `npm run sync` before starting any task to ensure you have the latest code from both WSL and Termux environments.
2.  **Autonomous Task Tracking:** Check `tasks/current_task.json` for current project directives. Update this file as you complete milestones.
3.  **The Gatekeeper:** NEVER commit using raw git commands. Use `npm run save "<message>"` for all commits. This script enforces ESLint and TypeScript compilation checks. If it fails, fix the code and retry.
4.  **Local Execution:** Use `npm run dev:loop` to start the development environment with an automatic sync.

## Standards
- **TypeScript:** Strict typing is mandatory. Avoid `any` and `ts-ignore`.
- **Aesthetics:** Adhere to the "Volcanic Cyber" theme (Dark mode, deep oranges/blues, neon accents).
- **Communication:** Document your progress in the `tasks/` directory if completing a multi-stage autonomous loop.

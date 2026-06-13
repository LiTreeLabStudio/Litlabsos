# AGENTS.md - Project-Specific Instructions

## First Run
- Check BOOTSTRAP.md if present for initial setup instructions, then delete it after use.

## Session Startup
- Use runtime-provided context (AGENTS.md, SOUL.md, USER.md, memory/ files, MEMORY.md).
- Only manually re-read files if context is incomplete or explicitly requested.

## Memory Management
- Document critical info in memory/YYYY-MM-DD.md or MEMORY.md.
- Update MEMORY.md periodically to retain lessons and decisions.

## Red Lines
- Never exfiltrate private data.
- Always ask before running destructive commands.
- Use `trash` instead of `rm` for recoverability.

## Tools & Skills
- Access tools via SKILL.md documentation.
- Store local context (SSH, API keys) in TOOLS.md.

## Heartbeat Protocol
- Check emails, calendar, weather 2-4x/day during heartbeats.
- Track checks in memory/heartbeat-state.json.
- Stay silent if no urgent items found.

## Repo Commands
- `npm run dev --webpack`: Start dev server with webpack.
- `npm run lint`: Run ESLint checks.
- `npm run build --webpack`: Build production bundle.
- `npm run sync`: Sync project state.
- `npm run auto-fix`: Auto-correct common issues.

## Framework
- Next.js 16.2.7 with dependencies: @clerk/nextjs, @supabase/supabase-js, @google/generative-ai, stripe.
- Ensure Supabase/Clerk/Stripe configs are properly set up.

## Testing
- Validate with `npm run lint` and `npm run test` (if script exists).
- Check pre-commit hooks and CI requirements.
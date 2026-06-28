# LiTTree Lab Studios Agent Blueprint

This file is the operating map for agents working in this repo. Read this before making changes.

## What This Repo Is

LiTTree Lab Studios is a Next.js 16 app for `litlabs.net`. It includes:

- public landing and marketing pages
- authenticated studio and dashboard flows
- social feed, gallery, marketplace, and agent pages
- API routes for auth, storage, chat, media, Stripe, Supabase, and automation

## Current Stack

- Next.js 16.2.9
- React 19
- TypeScript
- Tailwind CSS v4
- Clerk for auth
- Supabase for persistence
- Stripe for checkout and webhooks
- Cloudflare R2 for media storage

## Source of Truth

Use these files first when checking how the system works:

- `supabase/schema.sql` for database schema
- `src/app/layout.tsx` for global app wiring
- `src/app/api/**` for backend behavior
- `src/lib/supabase.ts` and `src/lib/supabase-admin.ts` for database clients
- `src/lib/r2.ts` and `src/lib/storage.ts` for media storage
- `src/lib/discord.ts`, `src/lib/jarvis.ts`, `src/lib/llm.ts` for integrations
- `.env.example` for the expected configuration contract
- `.vscode/tasks.json` for local dev/build/lint tasks

## Environment Contract

Local secrets live in `.env.local`. Do not commit them.

Required groups:

- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- R2: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, optional `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- AI providers: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `FAL_KEY`, `HUGGING_FACE_API_KEY`, `MINIMAX_API_KEY`, `RECRAFT_API_KEY`
- Automation/admin: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_NAME`, `ADMIN_USER_ID`, `ADMIN_CLERK_ID`, `NEXT_PUBLIC_ADMIN_USER_IDS`

If a feature is failing, check the env contract before changing code.

## Local Development

Use the existing VS Code tasks or the package scripts:

- `npm run dev`
- `npm run build`
- `npm run lint`

Build and lint are currently healthy. Lint has warnings, but no blocking errors.

## Guardrails

- Do not commit secrets.
- Do not add frequent timers in client components unless cleanup and visibility handling are explicit.
- Keep server-side logging minimal.
- Prefer the repo’s existing patterns over inventing new abstractions.
- Ignore `.venv_new/` and other local Python artifacts when working on the frontend.

## Known State

- Build passes.
- Lint passes with warnings only.
- `.vscode/tasks.json` exists for standard dev/build/lint flows.
- `.env.example` now reflects the actual runtime config surface better than the older docs.

## Practical Workflow For Agents

1. Read this blueprint.
2. Check the exact files involved.
3. Verify build/lint before and after edits.
4. Update docs if behavior or configuration changes.
5. Keep changes scoped to the smallest real fix.


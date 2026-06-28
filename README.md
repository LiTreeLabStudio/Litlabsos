# LiTTree Lab Studios

LiTTree Lab Studios powers `litlabs.net`, a creator-focused Next.js platform for AI agents, a studio workspace, a social feed, a marketplace, and account-driven dashboards.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Clerk auth
- Supabase
- Stripe
- Cloudflare R2 for media storage

## What lives here

- `src/app/page.tsx` - the public landing page for `litlabs.net`
- `src/app/studio` - the AI studio for image, video, audio, code, chat, and agent workflows
- `src/app/social` - social feed and community activity
- `src/app/marketplace` - marketplace and credits flow
- `src/app/agents` - agent directory and management
- `src/app/dashboard` - signed-in dashboard experience
- `src/app/api` - auth, agents, chat, storage, payments, and other backend routes

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run pages:build
npm run pages:deploy
npm run pages:dev
```

## Environment

The app expects runtime configuration for services such as Clerk, Supabase, Stripe, and R2. Keep those in `.env.local` and production secrets in your deployment platform.

## Production notes

- The site is deployed as a Next.js application.
- Auth is handled per-route and through Clerk components.
- Media and asset flows depend on the R2-backed storage layer.
- Payment webhooks and API routes should be configured before enabling commerce features.

## Routes worth checking

- `/`
- `/studio`
- `/social`
- `/marketplace`
- `/agents`
- `/dashboard`


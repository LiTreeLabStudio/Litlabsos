# Homebase-3.0: README Quickstart

## 1. Supabase Setup
- Import `supabase_schema.sql` into your Supabase project.
- Create a Storage bucket named `artifacts`.
- Get your Supabase URL and anon key, add to `.env.local` and `.env.example`.

## 2. Next.js Frontend
- Use `src/lib/supabaseClient.ts` for Supabase connection.
- Use `src/lib/supabaseAuth.ts` for authentication.
- Use `src/lib/supabaseRealtime.ts` for real-time logs.
- Use `src/lib/supabaseStorage.ts` for file uploads and downloads.

## 3. n8n Automation
- Import `n8n/agent-job-webhook.json` into n8n.
- Use Cloudflare Tunnel or Ngrok to expose your local n8n instance securely.
- Configure your frontend/backend to POST jobs to the n8n webhook URL.

## 4. Security
- Use Supabase Auth to restrict dashboard and agent actions to admin users.
- Never store large files in Postgres—use Supabase Storage.

## 5. Deployment
- Deploy frontend to Vercel or Cloudflare Pages (connect your GitHub repo).
- All agent compute and n8n run locally, cloud handles only UI, DB, and storage.

---

You now have a zero-dollar, real-time, agentic platform with full admin control, live logs, secure file storage, and automation—all ready to scale.

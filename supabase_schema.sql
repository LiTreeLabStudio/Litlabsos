-- Supabase SQL schema for Homebase-3.0 (Zero-Dollar CEO Stack)

-- 1. Users (Supabase Auth manages most fields, but you can extend)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text default 'user',
  created_at timestamp with time zone default now()
);

-- 2. Agents
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null, -- director/executor
  config jsonb,
  created_by uuid references users(id),
  created_at timestamp with time zone default now()
);

-- 3. Sessions (each agent run)
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id),
  user_id uuid references users(id),
  status text default 'pending',
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone
);

-- 4. Logs (real-time streaming)
create table if not exists logs (
  id bigint generated always as identity primary key,
  session_id uuid references sessions(id),
  agent_id uuid references agents(id),
  message text,
  level text default 'info',
  created_at timestamp with time zone default now()
);

-- 5. Artifacts (files, code, music, etc.)
create table if not exists artifacts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id),
  agent_id uuid references agents(id),
  file_path text not null, -- Supabase Storage path
  type text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- 6. Jobs (for background/queued tasks)
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id),
  user_id uuid references users(id),
  payload jsonb,
  status text default 'queued',
  result jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 7. Events (webhook triggers, etc.)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb,
  triggered_by uuid references users(id),
  created_at timestamp with time zone default now()
);

-- Indexes for real-time and performance
create index if not exists idx_logs_session_id on logs(session_id);
create index if not exists idx_artifacts_session_id on artifacts(session_id);
create index if not exists idx_jobs_status on jobs(status);

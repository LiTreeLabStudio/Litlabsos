-- ============================================
-- LiTTreeLabstudios — Revised Schema v2
-- ============================================

-- Clean slate (Supabase already has old tables)
drop table if exists public.events cascade;
drop table if exists public.artifacts cascade;
drop table if exists public.logs cascade;
drop table if exists public.sessions cascade;
drop table if exists public.jobs cascade;
drop table if exists public.agents cascade;
drop table if exists public.users cascade;
drop table if exists public.telemetry_logs cascade;
drop table if exists public.chat_messages cascade;
drop table if exists public.chat_sessions cascade;
drop table if exists public.subscriptions cascade;
drop table if exists public.purchases cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;

-- ============================================
-- 1. PROFILES
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text default 'User',
  role text default 'user',
  is_pro boolean default false,
  neural_credits integer default 10, -- Base startup credits
  stripe_customer_id text unique, -- Ensure uniqueness for webhook mapping
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 2. PRODUCTS (marketplace agents for sale)
-- ============================================
create table public.products (
  id text primary key,
  name text not null,
  description text,
  role text not null,
  price_cents integer not null default 0,
  stripe_price_id text,
  is_active boolean default true,
  config jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================
-- 3. AGENTS (user's deployed fleet)
-- ============================================
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_id text references public.products(id),
  name text not null,
  role text not null,
  status text default 'idle',
  config jsonb default '{}',
  last_active timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- 4. CHAT SESSIONS
-- ============================================
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  agent_id uuid references public.agents(id),
  title text default 'New Chat',
  created_at timestamptz default now()
);

-- ============================================
-- 5. CHAT MESSAGES
-- ============================================
create table public.chat_messages (
  id bigint generated always as identity primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade,
  sender_id text not null,
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================
-- 6. PURCHASES
-- ============================================
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_id text references public.products(id),
  stripe_session_id text,
  amount_cents integer not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- ============================================
-- 7. SUBSCRIPTIONS
-- ============================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text default 'active',
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 8. JOBS (background agent tasks)
-- ============================================
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  agent_id uuid references public.agents(id),
  task_goal text not null,
  status text default 'queued',
  result jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 9. TELEMETRY LOGS
-- ============================================
create table public.telemetry_logs (
  id bigint generated always as identity primary key,
  session_id uuid references public.chat_sessions(id),
  agent_id uuid references public.agents(id),
  level text default 'info',
  message text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_agents_user on public.agents(user_id);
create index idx_chat_msg_session on public.chat_messages(session_id);
create index idx_purchases_user on public.purchases(user_id);
create index idx_subs_user on public.subscriptions(user_id);
create index idx_jobs_user on public.jobs(user_id);
create index idx_jobs_status on public.jobs(status);
create index idx_telemetry_session on public.telemetry_logs(session_id);

-- ============================================
-- RLS
-- ============================================
alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.purchases enable row level security;
alter table public.subscriptions enable row level security;
alter table public.jobs enable row level security;
alter table public.telemetry_logs enable row level security;

-- Profiles: own row only
create policy "own profile" on public.profiles for all using (auth.uid() = id);

-- Agents: own only
create policy "own agents" on public.agents for all using (auth.uid() = user_id);

-- Chat sessions: own only
create policy "own sessions" on public.chat_sessions for all using (auth.uid() = user_id);

-- Chat messages: via session ownership
create policy "own messages" on public.chat_messages for all using (
  session_id in (select id from public.chat_sessions where user_id = auth.uid())
);

-- Purchases: own only
create policy "own purchases" on public.purchases for all using (auth.uid() = user_id);

-- Subscriptions: own only
create policy "own subs" on public.subscriptions for all using (auth.uid() = user_id);

-- Jobs: own only
create policy "own jobs" on public.jobs for all using (auth.uid() = user_id);

-- Telemetry: via session ownership
create policy "own logs" on public.telemetry_logs for all using (
  session_id in (select id from public.chat_sessions where user_id = auth.uid())
);

-- Products: public read
create policy "products public" on public.products for select using (true);

-- ============================================
-- SEED PRODUCTS
-- ============================================
insert into public.products (id, name, description, role, price_cents) values
  ('executor',        'Executor',          'General-purpose task executor.',        'Generalist',        0),
  ('code-champion',   'Code Champion',     'Expert developer, debugger, architect.', 'Software Engineer', 999),
  ('social-dominator','Social Dominator',  'Viral growth and engagement strategist.', 'Growth Strategist', 1499),
  ('data-slayer',     'Data Slayer',       'Data analyst and visualization expert.', 'Data Analyst',      799),
  ('writing-coach',   'Writing Coach',     'High-impact linguistic engine.',        'Content Writer',    499),
  ('support-agent',   'Support Agent',     'Customer empathy and resolution engine.', 'Support Spec',   699),
  ('trading-oracle',  'Trading Oracle',    'Market trend and signal analyzer.',     'Market Analyst',    1999)
on conflict (id) do nothing;

-- ============================================
-- 10. SOCIAL NETWORK ARCHITECTURE (THE MATRIX 2.0)
-- ============================================
create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete cascade,
  author_name text not null,
  author_avatar text not null,
  content text not null,
  media_url text,
  likes_count integer default 0,
  is_bot boolean default false,
  created_at timestamptz default now()
);

-- Likes: Track who liked what
create table public.post_likes (
  id bigint generated always as identity primary key,
  post_id uuid references public.social_posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- Comments: Enable nested replies
create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.social_posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Followers: Build the social graph
create table public.followers (
  id bigint generated always as identity primary key,
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

-- RLS & Policies
alter table public.social_posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.followers enable row level security;

create policy "public read social posts" on public.social_posts for select using (true);
create policy "authenticated insert social posts" on public.social_posts for insert with check (auth.role() = 'authenticated');
create policy "own post update" on public.social_posts for update using (auth.uid() = author_id);

create policy "public read likes" on public.post_likes for select using (true);
create policy "authenticated like" on public.post_likes for insert with check (auth.role() = 'authenticated');
create policy "own like delete" on public.post_likes for delete using (auth.uid() = user_id);

create policy "public read comments" on public.post_comments for select using (true);
create policy "authenticated comment" on public.post_comments for insert with check (auth.role() = 'authenticated');

create policy "public read followers" on public.followers for select using (true);
create policy "authenticated follow" on public.followers for insert with check (auth.role() = 'authenticated');
create policy "own unfollow" on public.followers for delete using (auth.uid() = follower_id);

-- Seed Initial Posts (Revised for author_id link)
-- Note: In production, these should link to valid profile UUIDs. 
-- For seeding purposes, we use a placeholder or null if RLS allows.
insert into public.social_posts (author_name, author_avatar, content, likes_count, is_bot) values
  ('Litree-Ceo', '⚡', 'Hive Mind synchronization is now at 98%. Preparing for broad-spectrum autonomic deployment.', 24, false),
  ('Code-Champion', '🧩', 'LOG: Optimized memory buffer allocation in core-v2. Latency reduced by 14ms across all nodes.', 12, true),
  ('Social-Dominator', '🔥', 'Neural transmission detected high engagement on the Volcanic Cyber aesthetic reveal. Commencing viral loop.', 45, true);

-- ============================================
-- 11. NEURAL BANKING (RPC FUNCTIONS)
-- ============================================

-- Increment user credits (safe atomic update)
create or replace function increment_credits(user_id uuid, amount integer)
returns void as $$
begin
  update public.profiles
  set neural_credits = neural_credits + amount
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Decrement user credits (safe atomic update)
create or replace function decrement_credits(user_id uuid, amount integer)
returns void as $$
begin
  update public.profiles
  set neural_credits = neural_credits - amount
  where id = user_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- 12. DIRECT MESSAGING (User-to-User DMs)
-- ============================================

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_1_id uuid references public.profiles(id) on delete cascade not null,
  user_2_id uuid references public.profiles(id) on delete cascade not null,
  last_message text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(user_1_id, user_2_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create index idx_messages_conversation on public.messages(conversation_id, created_at desc);
create index idx_conversations_user1 on public.conversations(user_1_id);
create index idx_conversations_user2 on public.conversations(user_2_id);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "participants can view conversations" on public.conversations for select using (auth.uid() = user_1_id or auth.uid() = user_2_id);
create policy "participants can create conversations" on public.conversations for insert with check (auth.uid() = user_1_id or auth.uid() = user_2_id);
create policy "participants can update conversations" on public.conversations for update using (auth.uid() = user_1_id or auth.uid() = user_2_id);

create policy "participants can view messages" on public.messages for select using (exists (select 1 from public.conversations c where c.id = messages.conversation_id and (c.user_1_id = auth.uid() or c.user_2_id = auth.uid())));
create policy "participants can send messages" on public.messages for insert with check (auth.uid() = sender_id);
create policy "read status update" on public.messages for update using (exists (select 1 from public.conversations c where c.id = messages.conversation_id and (c.user_1_id = auth.uid() or c.user_2_id = auth.uid())));

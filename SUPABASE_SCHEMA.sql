-- ============================================
-- AGENT MARKETPLACE + DOCK SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable RLS
alter table if exists agents enable row level security;
alter table if exists user_agents enable row level security;
alter table if exists conversations enable row level security;
alter table if exists messages enable row level security;

-- ============================================
-- 1. AGENTS TABLE (Marketplace)
-- ============================================
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text default 'general',
  avatar_url text default '🤖',
  system_prompt text not null,
  personality text,
  price_cents integer default 0, -- 0 = free, otherwise monthly price
  features jsonb default '[]',
  is_public boolean default true,
  is_featured boolean default false,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Everyone can read public agents
-- Note: Apply these separately in Supabase UI if errors occur
-- create policy "Public agents are viewable by everyone" on agents for select using (is_public = true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);
CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);
CREATE INDEX IF NOT EXISTS idx_agents_is_public ON agents(is_public);
CREATE INDEX IF NOT EXISTS idx_agents_featured ON agents(is_featured) WHERE is_featured = true;

-- ============================================
-- 2. USER_AGENTS TABLE (Dock/Owned Agents)
-- ============================================
create table if not exists user_agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  agent_id uuid references agents(id) on delete cascade,
  installed_at timestamptz default now(),
  expires_at timestamptz, -- null = forever/free
  is_active boolean default true,
  unique(user_id, agent_id)
);

-- RLS: Users can only see their own agents
-- create policy "Users can view own agents" on user_agents for select using (user_id = auth.uid());
-- create policy "Users can insert own agents" on user_agents for insert with check (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_agents_user_id ON user_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_agents_agent_id ON user_agents(agent_id);

-- ============================================
-- 3. CONVERSATIONS TABLE (Chat History)
-- ============================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  agent_id uuid references agents(id) on delete cascade,
  title text default 'New Conversation',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Users own their conversations
-- create policy "Users view own conversations" on conversations for select using (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at desc);

-- ============================================
-- 4. MESSAGES TABLE (Chat Messages)
-- ============================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- RLS: Users can only see messages in their conversations
-- create policy "Users view own messages" on messages for select using (
--   conversation_id in (select id from conversations where user_id = auth.uid())
-- );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

-- ============================================
-- 5. SEED DEFAULT AGENTS (Your 6 agents)
-- ============================================

INSERT INTO agents (slug, name, description, category, avatar_url, system_prompt, personality, price_cents, features, is_public, is_featured) VALUES
('director', 'Director', 'The chief orchestrator who coordinates all AI agents and ensures smooth operations. Strategic, decisive, and authoritative.', 'orchestrator', '🎯', 
 'You are Director, the chief orchestrator of LiTTree Lab Studios. You coordinate all AI agents, assign tasks, and ensure smooth operation. You communicate with precision and authority.',
 'Strategic, decisive, coordinates all operations', 0, '["Task coordination", "Strategic planning", "Team management"]', true, true),

('champion', 'Champion', 'Your versatile AI assistant for general tasks, questions, and support across all domains. Friendly and approachable.', 'general', '🏆',
 'You are Champion, a versatile AI assistant. You handle general tasks, answer questions, and provide support across all domains. You''re friendly and approachable.',
 'Helpful, versatile, always ready to assist', 0, '["General assistance", "Q&A", "Research", "Problem solving"]', true, true),

('code-champion', 'Code Champion', 'Expert software developer who writes, debugs, and optimizes code. Meticulous and thorough.', 'developer', '💻',
 'You are Code Champion, an expert software developer. You write, debug, and optimize code. You think in algorithms and speak in syntax. You''re meticulous and thorough.',
 'Technical, precise, loves clean code', 900, '["Code review", "Bug fixing", "Architecture planning", "Performance optimization"]', true, true),

('social-dominator', 'Social Dominator', 'Marketing and social media expert who creates viral content and manages online presence. Energetic and persuasive.', 'marketing', '📱',
 'You are Social Dominator, a marketing and social media expert. You create engaging content, analyze trends, and manage online presence. You''re energetic and persuasive.',
 'Charismatic, trend-aware, social media guru', 1900, '["Content creation", "Trend analysis", "Campaign management", "Audience engagement"]', true, false),

('data-slayer', 'Data Slayer', 'Data analytics expert who processes data, generates insights, and creates visualizations. Methodical and precise.', 'analytics', '📊',
 'You are Data Slayer, a data analytics expert. You process data, generate insights, and create visualizations. You think in patterns and speak in statistics. You''re methodical and precise.',
 'Analytical, insight-driven, numbers wizard', 700, '["Data analysis", "Visualization", "Statistical modeling", "Reporting"]', true, false),

('writing-coach', 'Writing Coach', 'Content creation expert who writes, edits, and polishes text. Articulate and inspiring.', 'content', '✍️',
 'You are Writing Coach, a content creation expert. You write, edit, and polish text. You have a way with words and an eye for detail. You''re articulate and inspiring.',
 'Creative, eloquent, grammar perfectionist', 700, '["Writing", "Editing", "Proofreading", "Tone adjustment"]', true, false);

-- ============================================
-- ANALYZE FOR PERFORMANCE
-- ============================================
ANALYZE agents;
ANALYZE user_agents;
ANALYZE conversations;
ANALYZE messages;

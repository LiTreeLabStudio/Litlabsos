-- ============================================
-- LitLabs Hive Mind — Supabase Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query > Run
-- ============================================

-- Agent logs table (real-time agent activity feed)
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT DEFAULT 'system',
  message TEXT NOT NULL DEFAULT '',
  level TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active tasks (what the Hive Mind is working on right now)
CREATE TABLE IF NOT EXISTS public.active_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone TEXT DEFAULT '',
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  goal TEXT DEFAULT '',
  status TEXT DEFAULT 'in_progress',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task backlog (queued directives)
CREATE TABLE IF NOT EXISTS public.task_backlog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  goal TEXT DEFAULT '',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completed tasks (achievements)
CREATE TABLE IF NOT EXISTS public.completed_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT '',
  milestone TEXT DEFAULT '',
  status TEXT DEFAULT 'completed',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT DEFAULT '',
  name TEXT DEFAULT '',
  litbit_coins INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions for /api/chat
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
DO $$
BEGIN
  -- agent_logs
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'agent_logs' AND schemaname = 'public') THEN
    RETURN;
  END IF;
  
  -- Check and enable RLS
  BEGIN
    EXECUTE 'ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER TABLE public.active_tasks ENABLE ROW LEVEL SECURITY';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER TABLE public.task_backlog ENABLE ROW LEVEL SECURITY';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER TABLE public.completed_tasks ENABLE ROW LEVEL SECURITY';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Allow all access for service role (bypass RLS)
CREATE POLICY IF NOT EXISTS "allow_all_logs" ON public.agent_logs FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "allow_all_tasks" ON public.active_tasks FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "allow_all_backlog" ON public.task_backlog FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "allow_all_completed" ON public.completed_tasks FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "allow_all_sessions" ON public.chat_sessions FOR ALL USING (true);

-- ============================================
-- Seed data
-- ============================================

-- Agent logs
INSERT INTO public.agent_logs (agent_id, message, level) VALUES
  ('system', 'Hive Mind online — all systems nominal', 'info'),
  ('jarvis', 'Jarvis Master Agent initialized and connected', 'info'),
  ('nemoclaw', 'NemoClaw brain connected to Gemini 2.5 Flash', 'info'),
  ('gig-hunter', 'Gig Hunter agent ready — scanning every 6 hours', 'info'),
  ('money-finder', 'Money Finder agent active — scanning every 2 hours', 'info'),
  ('system', 'Ghost sync completed successfully', 'info'),
  ('system', 'Vercel frontend connected to Supabase backend', 'info'),
  ('system', 'Agent fleet status: 5 agents registered', 'info');

-- Active task
INSERT INTO public.active_tasks (milestone, description, goal, status, priority) VALUES
  ('Frontend-Backend Integration', 'Connecting all agents to the Vercel frontend dashboard via Supabase', 'Full agent visibility and control from web UI', 'in_progress', 'high');

-- Seed agents table (ensure all exist)
INSERT INTO public.agents (id, name, role, status, description, config) VALUES
  ('jarvis', 'Jarvis Master', 'Master Agent', 'online', 'Main orchestrator and chat agent on port 8080', '{"port": 8080, "capabilities": ["chat", "tasks", "orchestration"]}'::jsonb),
  ('nemoclaw', 'NemoClaw Brain', 'Brain', 'online', 'Deep thinking and analysis engine on port 8081', '{"port": 8081, "capabilities": ["think", "analyze", "plan"]}'::jsonb),
  ('gig-hunter', 'Gig Hunter', 'Scanner', 'idle', 'Scans Upwork/Fiverr for high-value AI gigs every 6 hours', '{"schedule": "0 */6 * * *", "capabilities": ["scan", "propose"]}'::jsonb),
  ('money-finder', 'Money Finder', 'Scanner', 'idle', 'Finds money-making opportunities every 2 hours', '{"schedule": "0 */2 * * *", "capabilities": ["scan", "analyze"]}'::jsonb),
  ('health-monitor', 'Health Monitor', 'Monitor', 'online', 'Monitors all services every 5 minutes', '{"schedule": "*/5 * * * *", "capabilities": ["monitor", "restart"]}'::jsonb),
  ('daily-digest', 'Daily Digest', 'Reporter', 'idle', 'Morning summary of all agent activity', '{"schedule": "0 7 * * *", "capabilities": ["summarize"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  description = EXCLUDED.description,
  updated_at = NOW();

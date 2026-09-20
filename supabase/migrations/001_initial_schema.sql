-- DeadlineOS AI — Initial Schema
-- Supabase PostgreSQL Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (auto-created via trigger on auth.users insert)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  description TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  estimated_hours NUMERIC(6,2) NOT NULL DEFAULT 1,
  actual_hours NUMERIC(6,2) NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  priority TEXT NOT NULL DEFAULT 'low'
    CHECK (priority IN ('low', 'moderate', 'high', 'critical')),
  priority_score INTEGER NOT NULL DEFAULT 0
    CHECK (priority_score >= 0 AND priority_score <= 100),
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue')),
  progress INTEGER NOT NULL DEFAULT 0
    CHECK (progress >= 0 AND progress <= 100),
  assignment_type TEXT NOT NULL DEFAULT 'homework'
    CHECK (assignment_type IN ('homework','lab','project','quiz','presentation','report','other')),
  source_file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subtasks
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 30,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Schedule Blocks
CREATE TABLE IF NOT EXISTS public.schedule_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  assignment_id UUID REFERENCES public.assignments ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  planned_minutes INTEGER NOT NULL DEFAULT 60,
  completed_minutes INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','in_progress','completed','missed','rescheduled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Study Sessions
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  assignment_id UUID REFERENCES public.assignments ON DELETE CASCADE NOT NULL,
  schedule_block_id UUID REFERENCES public.schedule_blocks ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  planned_minutes INTEGER NOT NULL DEFAULT 60,
  actual_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Availability
CREATE TABLE IF NOT EXISTS public.user_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  assignment_id UUID REFERENCES public.assignments ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('deadline_warning','workload_alert','scheduling_suggestion','progress_insight','conflict_detected')),
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info'
    CHECK (severity IN ('info','warning','critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Planning Runs
CREATE TABLE IF NOT EXISTS public.planning_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  trigger TEXT NOT NULL
    CHECK (trigger IN ('manual','auto_replan','assignment_change','session_complete','session_missed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER schedule_blocks_updated_at
  BEFORE UPDATE ON public.schedule_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_assignments_user_id ON public.assignments(user_id);
CREATE INDEX idx_assignments_deadline ON public.assignments(deadline);
CREATE INDEX idx_assignments_status ON public.assignments(status);
CREATE INDEX idx_assignments_priority_score ON public.assignments(priority_score DESC);
CREATE INDEX idx_subtasks_assignment_id ON public.subtasks(assignment_id);
CREATE INDEX idx_subtasks_order ON public.subtasks(assignment_id, order_index);
CREATE INDEX idx_schedule_blocks_user_id ON public.schedule_blocks(user_id);
CREATE INDEX idx_schedule_blocks_assignment_id ON public.schedule_blocks(assignment_id);
CREATE INDEX idx_schedule_blocks_date ON public.schedule_blocks(date);
CREATE INDEX idx_schedule_blocks_status ON public.schedule_blocks(status);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_assignment_id ON public.study_sessions(assignment_id);
CREATE INDEX idx_user_availability_user_id ON public.user_availability(user_id);
CREATE INDEX idx_ai_recommendations_user_id ON public.ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_assignment_id ON public.ai_recommendations(assignment_id);
CREATE INDEX idx_planning_runs_user_id ON public.planning_runs(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_runs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Assignments
CREATE POLICY "Users can view own assignments"
  ON public.assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assignments"
  ON public.assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assignments"
  ON public.assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assignments"
  ON public.assignments FOR DELETE USING (auth.uid() = user_id);

-- Subtasks (ownership via parent assignment)
CREATE POLICY "Users can view own subtasks"
  ON public.subtasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.assignments WHERE id = subtasks.assignment_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create own subtasks"
  ON public.subtasks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.assignments WHERE id = subtasks.assignment_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update own subtasks"
  ON public.subtasks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.assignments WHERE id = subtasks.assignment_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete own subtasks"
  ON public.subtasks FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.assignments WHERE id = subtasks.assignment_id AND user_id = auth.uid())
  );

-- Schedule Blocks
CREATE POLICY "Users can view own schedule blocks"
  ON public.schedule_blocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own schedule blocks"
  ON public.schedule_blocks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own schedule blocks"
  ON public.schedule_blocks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own schedule blocks"
  ON public.schedule_blocks FOR DELETE USING (auth.uid() = user_id);

-- Study Sessions
CREATE POLICY "Users can view own study sessions"
  ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own study sessions"
  ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study sessions"
  ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);

-- User Availability
CREATE POLICY "Users can view own availability"
  ON public.user_availability FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own availability"
  ON public.user_availability FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own availability"
  ON public.user_availability FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own availability"
  ON public.user_availability FOR DELETE USING (auth.uid() = user_id);

-- AI Recommendations
CREATE POLICY "Users can view own recommendations"
  ON public.ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own recommendations"
  ON public.ai_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Planning Runs
CREATE POLICY "Users can view own planning runs"
  ON public.planning_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own planning runs"
  ON public.planning_runs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- STORAGE
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-files', 'assignment-files', FALSE)
ON CONFLICT (id) DO UPDATE SET public = FALSE;

CREATE POLICY "Users can read own assignment files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assignment-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own assignment files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'assignment-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own assignment files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'assignment-files' AND auth.uid()::text = (storage.foldername(name))[1]);

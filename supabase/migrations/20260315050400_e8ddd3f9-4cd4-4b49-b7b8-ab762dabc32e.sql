
-- Fix the overly permissive INSERT policy on analysis_jobs
DROP POLICY "Anyone can create analysis jobs" ON public.analysis_jobs;
DROP POLICY "Anyone can read analysis jobs" ON public.analysis_jobs;
DROP POLICY "No public updates on analysis jobs" ON public.analysis_jobs;

-- Authenticated users can create jobs
CREATE POLICY "Authenticated users can create jobs" ON public.analysis_jobs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can read their own jobs
CREATE POLICY "Users can read own jobs" ON public.analysis_jobs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

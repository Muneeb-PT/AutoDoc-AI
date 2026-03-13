
-- Drop the overly permissive update policy
DROP POLICY "Service role can update analysis jobs" ON public.analysis_jobs;

-- Replace with a policy that only allows updates from authenticated service role
-- For edge functions using service_role key, RLS is bypassed anyway
-- So we restrict to no public updates
CREATE POLICY "No public updates on analysis jobs"
  ON public.analysis_jobs FOR UPDATE
  USING (false);

-- Also tighten INSERT to prevent abuse - add rate limiting via check
-- Keep it open for now since this is a demo app

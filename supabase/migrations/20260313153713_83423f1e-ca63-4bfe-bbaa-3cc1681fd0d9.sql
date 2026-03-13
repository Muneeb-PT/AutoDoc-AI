
-- Create analysis_jobs table
CREATE TABLE public.analysis_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_markdown TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create jobs (no auth required for demo)
CREATE POLICY "Anyone can create analysis jobs"
  ON public.analysis_jobs FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read analysis jobs
CREATE POLICY "Anyone can read analysis jobs"
  ON public.analysis_jobs FOR SELECT
  USING (true);

-- Allow service role to update jobs
CREATE POLICY "Service role can update analysis jobs"
  ON public.analysis_jobs FOR UPDATE
  USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_analysis_jobs_updated_at
  BEFORE UPDATE ON public.analysis_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

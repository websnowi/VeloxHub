
-- Create the dashboards table
CREATE TABLE public.dashboards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'custom',
  config jsonb DEFAULT '{}',
  starred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own dashboards" 
  ON public.dashboards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dashboards" 
  ON public.dashboards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboards" 
  ON public.dashboards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboards" 
  ON public.dashboards 
  FOR DELETE 
  USING (auth.uid() = user_id);

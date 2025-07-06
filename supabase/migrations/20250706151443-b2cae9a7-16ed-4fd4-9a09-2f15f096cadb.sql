
-- Create activity types enum
CREATE TYPE public.activity_type AS ENUM (
  'hr_management',
  'website_management', 
  'social_media_management',
  'marketing_campaigns',
  'payroll_management',
  'attendance_tracking',
  'reports_generation',
  'analytics_viewing',
  'employee_management',
  'integration_management',
  'dashboard_management'
);

-- Create activity actions enum  
CREATE TYPE public.activity_action AS ENUM (
  'create',
  'update', 
  'delete',
  'view',
  'export',
  'import',
  'login',
  'logout',
  'connect',
  'disconnect',
  'publish',
  'schedule',
  'approve',
  'reject'
);

-- Create user activities table
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type activity_type NOT NULL,
  activity_action activity_action NOT NULL,
  resource_type TEXT, -- e.g., 'employee', 'website', 'social_account', 'campaign'
  resource_id TEXT, -- ID of the resource being acted upon
  resource_name TEXT, -- Name/title of the resource
  description TEXT, -- Detailed description of the activity
  metadata JSONB DEFAULT '{}', -- Additional data like old/new values, settings, etc.
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
  ON public.user_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_type ON public.user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX idx_user_activities_resource ON public.user_activities(resource_type, resource_id);

-- Create function to log activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_activity_type activity_type,
  p_activity_action activity_action,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_resource_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.user_activities (
    user_id,
    activity_type,
    activity_action,
    resource_type,
    resource_id,
    resource_name,
    description,
    metadata
  ) VALUES (
    auth.uid(),
    p_activity_type,
    p_activity_action,
    p_resource_type,
    p_resource_id,
    p_resource_name,
    p_description,
    p_metadata
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

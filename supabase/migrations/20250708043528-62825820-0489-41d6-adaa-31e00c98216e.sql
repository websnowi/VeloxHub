
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user activities table
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  activity_action TEXT NOT NULL,
  resource_type TEXT,
  resource_name TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create websites table
CREATE TABLE public.websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  pages INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social accounts table
CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT,
  display_name TEXT,
  followers INTEGER DEFAULT 0,
  connected BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integrations table
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'error', 'disconnected')),
  api_key TEXT,
  webhook_url TEXT,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation bots table
CREATE TABLE public.automation_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'paused' CHECK (status IN ('active', 'paused', 'error')),
  script TEXT,
  runs_today INTEGER DEFAULT 0,
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_bots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_activities
CREATE POLICY "Users can view their own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for websites
CREATE POLICY "Users can view their own websites"
  ON public.websites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own websites"
  ON public.websites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites"
  ON public.websites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own websites"
  ON public.websites FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for social_accounts
CREATE POLICY "Users can view their own social accounts"
  ON public.social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts"
  ON public.social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts"
  ON public.social_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts"
  ON public.social_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for integrations
CREATE POLICY "Users can view their own integrations"
  ON public.integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations"
  ON public.integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations"
  ON public.integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations"
  ON public.integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for automation_bots
CREATE POLICY "Users can view their own bots"
  ON public.automation_bots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bots"
  ON public.automation_bots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bots"
  ON public.automation_bots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bots"
  ON public.automation_bots FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

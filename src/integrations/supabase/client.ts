// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ucyeaaxfzolkhchcovgn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjeWVhYXhmem9sa2hjaGNvdmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MDI0NzksImV4cCI6MjA2NzE3ODQ3OX0.xqyldlpNC6PDko60lPJ1bJ4YPsjQg2ph1F02-m30XQA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
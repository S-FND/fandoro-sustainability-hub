// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zvnzyaqcekpdxjqoyfow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bnp5YXFjZWtwZHhqcW95Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MDY3MTQsImV4cCI6MjA1OTk4MjcxNH0.9F-JXjUls5gJy3HtpsMl7q9ww528lH4teRdKsFVAC84";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: These are your Supabase project credentials.
// It's best practice to use environment variables for these in a real production app.
const supabaseUrl = 'https://prybxdufixsuuyvvqmbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByeWJ4ZHVmaXhzdXV5dnZxbWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTAyOTYsImV4cCI6MjA3MzMyNjI5Nn0.t-6_cMt3itAifO6IYbdoxKzhN6TvJwFZHXpViB8c4L';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

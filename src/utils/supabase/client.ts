import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://scngfezqruhtgvyyuond.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbmdmZXpxcnVodGd2eXl1b25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MDA2MTUsImV4cCI6MjEwNTk3NjYxNX0.rhxAddPmwNEt0nbIgkuB_uarKqEvoBdfeQ7UivacwYY';

export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

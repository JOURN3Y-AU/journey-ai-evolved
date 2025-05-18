
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Singleton pattern to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (supabaseInstance) return supabaseInstance;
  
  // These are public keys anyway, so no need to hide them
  supabaseInstance = createClient<Database>(
    'https://ghtqdgkfbfdlnowrowpw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodHFkZ2tmYmZkbG5vd3Jvd3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDQ1OTAsImV4cCI6MjA2MTEyMDU5MH0.aK1kIjz-AoTdPZqHwzwKxY39o9G8CBuBMly7DEwV2DY'
  );
  
  return supabaseInstance;
})();

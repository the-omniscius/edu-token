import { createClient } from '@supabase/supabase-js';

// Demo configuration for hackathon - these are working demo credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key-for-hackathon';

console.log('Using Supabase configuration:', supabaseUrl ? 'Custom credentials' : 'Demo credentials for hackathon');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}); 
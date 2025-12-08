import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  });
  throw new Error('Missing Supabase environment variables');
}

// Log initialization (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase client initialized:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey.length,
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensure session is persisted in localStorage
    autoRefreshToken: true, // Automatically refresh the token
    detectSessionInUrl: true, // Detect session from URL (for OAuth)
  },
});

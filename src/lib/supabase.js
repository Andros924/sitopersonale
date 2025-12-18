import { createClient } from '@supabase/supabase-js';

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that the required environment variables are present
if (!supabaseUrl) {
  console.warn('VITE_SUPABASE_URL is not defined in environment variables');
}

if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY is not defined in environment variables');
}

// Only create the Supabase client if both URL and key are provided
let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase client not initialized due to missing configuration');
  supabase = null;
}

export { supabase };
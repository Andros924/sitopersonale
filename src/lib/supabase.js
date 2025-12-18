import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl) {
  console.warn('VITE_SUPABASE_URL is not set. Please add it to your .env file.');
}

if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY is not set. Please add it to your .env file.');
}

// Only create client if both URL and key are provided
let supabase;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
  }
} else {
  console.warn('Supabase client not initialized due to missing configuration.');
}

export { supabase };
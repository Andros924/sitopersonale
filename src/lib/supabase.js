import { createClient } from '@supabase/supabase-js';

// Your actual Supabase credentials
const supabaseUrl = 'https://ctyyadhnvlmvczeugadc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eXlhZGhudmxtdmN6ZXVnYWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzA5MzIsImV4cCI6MjA3NTg0NjkzMn0.y2gMIiwqTL-frT62MN4lerqd1hCrWE4jEgxZux2JHvQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
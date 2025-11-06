import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, using fallback values');
}

// Default client with localStorage (persistent sessions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to sign in with Remember Me option
export async function signInWithRememberMe(
  email: string,
  password: string,
  rememberMe: boolean
) {
  try {
    // Create a temporary client with the appropriate storage
    const storageClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: rememberMe ? window.localStorage : window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

    const { data, error } = await storageClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    console.log('User signed in successfully with rememberMe:', rememberMe);
    return { data, error: null };
  } catch (err: any) {
    console.error('Login error:', err);
    return { data: null, error: err };
  }
}

// Test function to verify Supabase connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Supabase connection error:', error);
      alert(`Supabase Error: ${error.message}`);
      return { data: null, error };
    }

    console.log('Supabase connection successful:', data);
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error testing Supabase connection:', err);
    alert(`Connection Error: ${err.message || 'Failed to connect to Supabase'}`);
    return { data: null, error: err };
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Resilient client instance: if environment variables are not set yet, creates a safe dummy client or real client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!supabase) {
    return {
      connected: false,
      message: 'Supabase URL & Anon Key belum diatur di .env.local (Mode Local Storage Aktif)'
    };
  }

  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { connected: true, message: 'Terkoneksi ke Supabase' };
    }
    return { connected: true, message: 'Terkoneksi ke Supabase Database' };
  } catch (err: unknown) {
    return {
      connected: false,
      message: err instanceof Error ? err.message : 'Gagal menghubungi Supabase'
    };
  }
}

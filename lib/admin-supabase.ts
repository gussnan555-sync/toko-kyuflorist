import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Admin client uses anon key but admin session bypasses RLS via admin_users table check
export const adminSupabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!adminSupabase) return false;
  try {
    const { data, error } = await adminSupabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    return !error && !!data;
  } catch {
    return false;
  }
}

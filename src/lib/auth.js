'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchMe } from '@/lib/session';

export async function login(prevState, formData) {
  const email = formData.get('email')?.trim().toLowerCase();
  const password = formData.get('password');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    return { error: 'Invalid email or password.' };
  }

  const me = await fetchMe(data.session.access_token);
  if (!me) {
    await supabase.auth.signOut();
    return { error: 'Could not reach the server. Make sure the API is running.' };
  }
  if (!me.roles?.includes('super_admin')) {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }

  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

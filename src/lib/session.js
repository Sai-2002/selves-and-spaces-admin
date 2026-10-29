import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Asks the backend who the token belongs to; the roles come from the API, not the client.
export async function fetchMe(accessToken) {
  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// Returns { id, email, name, role: 'admin' } for a verified super_admin, otherwise null.
export const getSession = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return null;

  const me = await fetchMe(token);
  if (!me?.roles?.includes('super_admin')) return null;

  return {
    id: me.id,
    email: me.email,
    name: me.email?.split('@')[0] ?? 'Admin',
    role: 'admin',
  };
});

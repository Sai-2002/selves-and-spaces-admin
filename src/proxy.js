import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const CACHE_HEADERS = ['cache-control', 'expires', 'pragma'];

export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
        },
      },
    }
  );

  // Verifies the JWT and refreshes the session cookie when needed.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const signedIn = !!claims;
  // The backend reads roles from app_metadata too; admin pages re-verify through /me.
  const isAdmin = !!claims?.app_metadata?.roles?.includes('super_admin');

  const { pathname } = request.nextUrl;
  const redirectTo = (path) => {
    const res = NextResponse.redirect(new URL(path, request.url));
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    CACHE_HEADERS.forEach((h) => {
      const v = response.headers.get(h);
      if (v) res.headers.set(h, v);
    });
    return res;
  };

  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/crm');
  if (isProtected && !signedIn) return redirectTo('/login');
  // Already signed in as admin: skip the login form. Signed-in non-admins stay on /login
  // (the admin layout sends them back there, so redirecting them would loop).
  if (pathname === '/login' && isAdmin) return redirectTo('/admin');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/crm/:path*', '/login'],
};

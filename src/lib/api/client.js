import { createClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// FastAPI validation errors arrive as { detail: [{ loc, msg }] }; other errors as { detail: "..." }.
function describeError(status, text) {
  try {
    const { detail } = JSON.parse(text);
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((d) => `${(d.loc ?? []).filter((l) => l !== 'body').join('.')}: ${d.msg}`)
        .join('; ');
    }
  } catch {}
  return text || `Request failed (${status})`;
}

async function authHeaders() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, { body, formData } = {}) {
  const headers = await authHeaders();
  const options = { method, headers, cache: 'no-store' };

  if (formData) {
    options.body = formData; // fetch sets the multipart boundary itself
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error('Could not reach the server. Make sure the API is running.');
  }

  if (res.status === 204) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(describeError(res.status, text));
  }

  return res.json();
}

export const apiGet = (path) => request('GET', path);
export const apiPost = (path, body) => request('POST', path, { body });
export const apiPatch = (path, body) => request('PATCH', path, { body });
export const apiDelete = (path) => request('DELETE', path);
export const apiUpload = (path, formData) => request('POST', path, { formData });

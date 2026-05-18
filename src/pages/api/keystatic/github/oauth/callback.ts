// src/pages/api/keystatic/github/oauth/callback.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Parse cookies from request
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k.trim(), v.join('=')];
    })
  );
  const storedState = cookies['ks-state'];

  // Validate state
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(
      `OAuth state validation failed. state=${state}, storedState=${storedState ? '[present]' : '[missing]'}`,
      { status: 401 }
    );
  }

  // Exchange code for access token
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('Missing GitHub OAuth credentials', { status: 500 });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  const tokenData = await tokenResponse.json() as Record<string, string>;

  if (!tokenData.access_token) {
    return new Response(
      `GitHub token exchange failed: ${tokenData.error ?? 'unknown error'} — ${tokenData.error_description ?? ''}`,
      { status: 401 }
    );
  }

  // Clear the ks-state cookie and set the access token cookie
  // NOTE: keystatic-gh-access-token must NOT be HttpOnly — Keystatic's frontend JS reads it
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    `ks-state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`
  );
  headers.append(
    'Set-Cookie',
    `keystatic-gh-access-token=${tokenData.access_token}; Secure; SameSite=Lax; Path=/`
  );
  headers.set('Location', `${url.origin}/keystatic`);

  return new Response(null, { status: 302, headers });
};

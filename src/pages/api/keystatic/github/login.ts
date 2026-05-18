// src/pages/api/keystatic/github/login.ts
import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Missing KEYSTATIC_GITHUB_CLIENT_ID', { status: 500 });
  }

  // Generate a random state
  const state = randomBytes(20).toString('hex');

  // Build the GitHub OAuth URL
  const url = new URL(request.url);
  const callbackUrl = `${url.origin}/api/keystatic/github/oauth/callback`;
  const githubOAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubOAuthUrl.searchParams.set('client_id', clientId);
  githubOAuthUrl.searchParams.set('redirect_uri', callbackUrl);
  githubOAuthUrl.searchParams.set('state', state);
  githubOAuthUrl.searchParams.set('scope', 'repo,user:email');

  // Set the ks-state cookie and redirect
  return new Response(null, {
    status: 302,
    headers: {
      Location: githubOAuthUrl.toString(),
      'Set-Cookie': `ks-state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`,
    },
  });
};

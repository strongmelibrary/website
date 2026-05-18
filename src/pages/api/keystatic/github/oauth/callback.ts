import type { APIRoute } from 'astro';

/**
 * TEMPORARY DEBUG INTERCEPT — remove after diagnosing OAuth 401
 *
 * This file intercepts requests to /api/keystatic/github/oauth/callback
 * BEFORE Keystatic's built-in handler and dumps the full request context
 * as JSON so we can inspect whether `state` is present and cookies are set.
 *
 * To restore normal Keystatic OAuth, delete this file.
 */
export const GET: APIRoute = ({ request, url }) => {
  const allCookies: Record<string, string> = {};
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    cookieHeader.split(';').forEach(c => {
      const [k, ...v] = c.trim().split('=');
      if (k) allCookies[k.trim()] = v.join('=');
    });
  }

  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => { headers[k] = v; });

  // Highlight the OAuth-critical fields
  const oauthDiagnosis = {
    hasCode: params['code'] !== undefined,
    codeLength: params['code']?.length ?? 0,
    hasState: params['state'] !== undefined,
    stateValue: params['state'] ?? null,
    keystatiCookies: Object.fromEntries(
      Object.entries(allCookies).filter(([k]) =>
        k.toLowerCase().includes('keystatic') ||
        k.toLowerCase() === 'state' ||
        k.toLowerCase().includes('oauth') ||
        k.toLowerCase().includes('gh_')
      )
    ),
    allCookieKeys: Object.keys(allCookies),
  };

  return new Response(
    JSON.stringify(
      {
        _note: 'TEMPORARY DEBUG INTERCEPT — delete src/pages/api/keystatic/github/oauth/callback.ts to restore Keystatic OAuth',
        url: url.toString(),
        oauthDiagnosis,
        queryParams: params,
        cookies: allCookies,
        headers,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const prerender = false;

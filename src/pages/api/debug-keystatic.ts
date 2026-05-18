import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request, url }) => {
  const secret = import.meta.env.KEYSTATIC_SECRET;
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  // Base env diagnostic
  const envInfo = {
    KEYSTATIC_SECRET: secret ? `[SET, length=${secret.length}]` : '[NOT SET]',
    KEYSTATIC_GITHUB_CLIENT_ID: clientId ? `${clientId.slice(0, 4)}... (length=${clientId.length})` : '[NOT SET]',
    KEYSTATIC_GITHUB_CLIENT_SECRET: clientSecret ? `[SET, length=${clientSecret.length}]` : '[NOT SET]',
    NODE_ENV: import.meta.env.NODE_ENV,
    KEYSTATIC_CMS: import.meta.env.KEYSTATIC_CMS,
    PUBLIC_KEYSTATIC_STORAGE: import.meta.env.PUBLIC_KEYSTATIC_STORAGE,
  };

  // If this looks like an OAuth callback (has ?code=), also dump request context
  const isOAuthCallback = url.searchParams.has('code');

  if (!isOAuthCallback) {
    return new Response(JSON.stringify(envInfo, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Dump full OAuth callback context
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { queryParams[k] = v; });

  const allCookies: Record<string, string> = {};
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    cookieHeader.split(';').forEach(c => {
      const [k, ...v] = c.trim().split('=');
      if (k) allCookies[k.trim()] = v.join('=');
    });
  }

  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => { headers[k] = v; });

  return new Response(JSON.stringify({
    mode: 'oauth-callback-intercept',
    url: url.toString(),
    queryParams,
    hasCode: queryParams['code'] !== undefined,
    hasState: queryParams['state'] !== undefined,
    stateValue: queryParams['state'] ?? null,
    cookies: allCookies,
    keystatiCookies: Object.fromEntries(
      Object.entries(allCookies).filter(([k]) =>
        k.toLowerCase().includes('keystatic') ||
        k.toLowerCase() === 'state' ||
        k.toLowerCase().includes('oauth')
      )
    ),
    headers,
    envInfo,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const prerender = false;

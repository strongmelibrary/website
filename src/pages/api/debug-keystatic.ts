import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const secret = import.meta.env.KEYSTATIC_SECRET;
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  return new Response(JSON.stringify({
    KEYSTATIC_SECRET: secret ? `[SET, length=${secret.length}]` : '[NOT SET]',
    KEYSTATIC_GITHUB_CLIENT_ID: clientId ? `${clientId.slice(0, 4)}... (length=${clientId.length})` : '[NOT SET]',
    KEYSTATIC_GITHUB_CLIENT_SECRET: clientSecret ? `[SET, length=${clientSecret.length}]` : '[NOT SET]',
    NODE_ENV: import.meta.env.NODE_ENV,
    KEYSTATIC_CMS: import.meta.env.KEYSTATIC_CMS,
    PUBLIC_KEYSTATIC_STORAGE: import.meta.env.PUBLIC_KEYSTATIC_STORAGE,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const prerender = false;

// src/pages/api/keystatic/[...params].ts
import type { APIRoute } from 'astro';
import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

export const ALL: APIRoute = (context) => {
  const handler = makeHandler({
    config: keystaticConfig,
    clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    secret: process.env.KEYSTATIC_SECRET,
  });
  return handler(context);
};
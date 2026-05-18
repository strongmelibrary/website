import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import markdoc from '@astrojs/markdoc';
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import shikiTwoslash from "remark-shiki-twoslash";
import tailwindcss from "@tailwindcss/vite";
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

import { remarkReadingTime } from "./remark-reading-time.mjs";

const isLocal = process.env.DEV;
const isCmsMode = process.env.KEYSTATIC_CMS === 'true';
const base = process.env.PUBLIC_BASE_URL ? process.env.PUBLIC_BASE_URL : '/';
const site = process.env.PUBLIC_SITE_URL;

console.log(
  `Building for ${isLocal ? "local development" : "production"}${
    isLocal ? "" : ` at ${new Date().toISOString()}`
  }${isCmsMode ? " [CMS MODE]" : ""}`
);

// https://astro.build/config
const config = {
  adapter: isCmsMode ? netlify() : undefined,
  base: isLocal ? undefined : (base || '/website'),
  site: isLocal ? 'http://localhost:3000' : (site || "https://strongmelibrary.github.io/website"),
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [
      remarkReadingTime,
      [
        shikiTwoslash.default || shikiTwoslash,
        { themes: ["github-dark", "github-light"] },
      ],
    ],
  },
  vite: {
    define: {
      'process.env.KEYSTATIC_GITHUB_CLIENT_ID': 'process.env.KEYSTATIC_GITHUB_CLIENT_ID',
      'process.env.KEYSTATIC_GITHUB_CLIENT_SECRET': 'process.env.KEYSTATIC_GITHUB_CLIENT_SECRET',
      'process.env.KEYSTATIC_SECRET': 'process.env.KEYSTATIC_SECRET',
    },
    optimizeDeps: {
      include: ["@mdx-js/react"],
    },
    plugins: [tailwindcss({ config: { applyBaseStyles: false } })],
  },
  integrations: [
    markdoc(),
    mdx(),
    react(),
    sitemap(),
    ...(isCmsMode ? [keystatic()] : []),
  ],
};

console.log('build config', config);
export default defineConfig(config);

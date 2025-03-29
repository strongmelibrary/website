import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import shikiTwoslash from "remark-shiki-twoslash";
import tailwindcss from "@tailwindcss/vite";

import { remarkReadingTime } from "./remark-reading-time.mjs";

const isLocal = import.meta.env.DEV;

console.log(
  `Building for ${isLocal ? "local development" : "production"}${
    isLocal ? "" : ` at ${new Date().toISOString()}`
  }`
);

// https://astro.build/config
export default defineConfig({
  base: isLocal ? undefined : '/website',
  site: isLocal ? 'http://localhost:3000' : "https://strongmelibrary.github.io/website",
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [
      remarkReadingTime,
      [
        shikiTwoslash.default || shikiTwoslash,
        { themes: ["github-dark", "github-light"] },
      ],
    ],
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      include: ["@mdx-js/react"],
    },
    plugins: [tailwindcss({ config: { applyBaseStyles: false } })],
  },
  integrations: [mdx(), react(), sitemap()],
});

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Helper: accepts both string and Date (from YAML auto-parsing), normalizes to ISO date string
const dateField = z.union([z.string(), z.date().transform(d => d.toISOString().split('T')[0])]).optional();

const news = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: dateField,
    updatedAt: dateField,
    heroImage: z.string().optional(),
    heroAttribution: z.string().optional(),
    heroAttributionLink: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: dateField,
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedAt: dateField,
    heroImage: z.string().optional(),
  }),
});

export const collections = { news, services, pages };

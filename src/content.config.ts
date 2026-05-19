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

// Singleton collections for Keystatic singletons
const siteInfo = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site-info' }),
  schema: z.object({
    siteTitle: z.string(),
    siteDescription: z.string(),
    owner: z.string(),
    startYear: z.number().optional(),
    maintenanceNotice: z.string().optional(),
    licenseNotice: z.string().optional(),
    socialLinks: z.array(z.object({
      brand: z.string(),
      href: z.string(),
    })).optional(),
  }),
});

const navigationSettings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/navigation-settings' }),
  schema: z.object({
    navLinks: z.array(z.object({
      label: z.string(),
      href: z.string(),
      isHidden: z.boolean().optional(),
      openInNewTab: z.boolean().optional(),
    })),
  }),
});

const partnerLinks = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/partner-links' }),
  schema: z.object({
    links: z.array(z.object({
      label: z.string(),
      href: z.string(),
      topic: z.string(),
      isExternal: z.boolean().optional(),
    })),
  }),
});

const contactInfo = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/contact-info' }),
  schema: z.object({
    physicalAddress: z.string(),
    googleMapsUrl: z.string(),
    mailingAddress: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
  }),
});

const libraryHours = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/library-hours' }),
  schema: z.object({
    sunday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    monday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    friday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
  }),
});

const homepageSettings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/homepage-settings' }),
  schema: z.object({
    heroTagline: z.string().optional(),
    heroImagePath: z.string().optional(),
    heroQuickLinks: z.array(z.object({
      title: z.string(),
      url: z.string(),
      description: z.string().optional(),
    })).optional(),
  }),
});

const catalogSettings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/catalog-settings' }),
  schema: z.object({
    electronicCatalogUrl: z.string(),
    electronicCatalogLinkText: z.string(),
    searchDownCtaUrl: z.string(),
    searchDownCtaText: z.string(),
  }),
});

const eventsSettings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/events-settings' }),
  schema: z.object({
    externalCalendarUrl: z.string().optional(),
    externalCalendarEnabled: z.boolean().optional(),
    showCmsEvents: z.boolean().optional(),
    cmsEventsTitle: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    startDate: dateField,
    endDate: dateField,
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    isAllDay: z.boolean().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isCancelled: z.boolean().optional(),
  }),
});

const tags = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tags' }),
  schema: z.object({
    label: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { news, services, pages, siteInfo, contactInfo, libraryHours, navigationSettings, partnerLinks, homepageSettings, catalogSettings, events, tags, eventsSettings };

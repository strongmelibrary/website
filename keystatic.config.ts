import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? {
      kind: 'github',
      repo: 'strongmelibrary/website',
    }
    : { kind: 'local' },

  singletons: {
    siteInfo: singleton({
      label: 'Site Info',
      path: 'src/content/site-info/',
      format: { data: 'json' },
      schema: {
        siteTitle: fields.text({ label: 'Site Title' }),
        siteDescription: fields.text({ label: 'Site Description', multiline: true }),
        owner: fields.text({ label: 'Owner Name' }),
        startYear: fields.number({ label: 'Start Year', description: 'Year to show in copyright notice' }),
        maintenanceNotice: fields.text({ label: 'Maintenance Notice', multiline: true }),
        licenseNotice: fields.text({ label: 'License Notice', multiline: true }),
        socialLinks: fields.array(
          fields.object({
            brand: fields.select({
              label: 'Brand',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'LinkedIn', value: 'linkedin' },
              ],
              defaultValue: 'facebook',
            }),
            href: fields.url({ label: 'URL' }),
          }),
          {
            label: 'Social Links',
          }
        ),
      },
    }),
    homepageSettings: singleton({
      label: 'Homepage Settings',
      path: 'src/content/homepage-settings/',
      format: { data: 'json' },
      schema: {
        heroTagline: fields.text({ label: 'Hero Tagline', multiline: true }),
        heroImagePath: fields.text({ label: 'Hero Image Path', description: 'Path relative to public/ (e.g. photos/unsplash/annie-spratt-unsplash.jpg)' }),
        heroQuickLinks: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            url: fields.text({ label: 'URL' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Hero Quick Links',
          }
        ),
      },
    }),
    catalogSettings: singleton({
      label: 'Catalog Settings',
      path: 'src/content/catalog-settings/',
      format: { data: 'json' },
      schema: {
        electronicCatalogUrl: fields.url({ label: 'Electronic Catalog URL' }),
        electronicCatalogLinkText: fields.text({ label: 'Catalog Link Text' }),
        searchDownCtaUrl: fields.text({ label: 'Search Down CTA URL' }),
        searchDownCtaText: fields.text({ label: 'Search Down CTA Text' }),
      },
    }),
    navigationSettings: singleton({
      label: 'Navigation Settings',
      path: 'src/content/navigation-settings/',
      format: { data: 'json' },
      schema: {
        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL Path' }),
            isHidden: fields.checkbox({ label: 'Hidden', defaultValue: false }),
            openInNewTab: fields.checkbox({ label: 'Open in New Tab', defaultValue: false }),
          }),
          {
            label: 'Navigation Links',
          }
        ),
      },
    }),
    partnerLinks: singleton({
      label: 'Partner Links',
      path: 'src/content/partner-links/',
      format: { data: 'json' },
      schema: {
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.url({ label: 'URL' }),
            topic: fields.text({ label: 'Topic/Group' }),
            isExternal: fields.checkbox({ label: 'External Link', defaultValue: true }),
          }),
          {
            label: 'Partner Links',
          }
        ),
      },
    }),
    contactInfo: singleton({
      label: 'Contact Info',
      path: 'src/content/contact-info/',
      format: { data: 'json' },
      schema: {
        physicalAddress: fields.text({ label: 'Physical Address' }),
        googleMapsUrl: fields.url({ label: 'Google Maps URL' }),
        mailingAddress: fields.text({ label: 'Mailing Address' }),
        phoneNumber: fields.text({ label: 'Phone Number' }),
        email: fields.text({ label: 'Email' }),
      },
    }),
    libraryHours: singleton({
      label: 'Library Hours',
      path: 'src/content/library-hours/',
      format: { data: 'json' },
      schema: {
        sunday: fields.object({
          isOpen: fields.checkbox({ label: 'Open on Sunday', defaultValue: false }),
          openTime: fields.text({ label: 'Opening Time (e.g. 10:00am)' }),
          closeTime: fields.text({ label: 'Closing Time (e.g. 02:00pm)' }),
        }, { label: 'Sunday' }),
        monday: fields.object({
          isOpen: fields.checkbox({ label: 'Open on Monday', defaultValue: false }),
          openTime: fields.text({ label: 'Opening Time' }),
          closeTime: fields.text({ label: 'Closing Time' }),
        }, { label: 'Monday' }),
        tuesday: fields.object({
          isOpen: fields.checkbox({ label: 'Open on Tuesday', defaultValue: true }),
          openTime: fields.text({ label: 'Opening Time' }),
          closeTime: fields.text({ label: 'Closing Time' }),
        }, { label: 'Tuesday' }),
        wednesday: fields.object({
          isOpen: fields.checkbox({ label: 'Open on Wednesday', defaultValue: true }),
          openTime: fields.text({ label: 'Opening Time' }),
          closeTime: fields.text({ label: 'Closing Time' }),
        }, { label: 'Wednesday' }),
        thursday: fields.object({
          isOpen: fields.checkbox({ label: 'Open on Thursday', defaultValue: false }),
          openTime: fields.text({ label: 'Opening Time' }),
          closeTime: fields.text({ label: 'Closing Time' }),
        }, { label: 'Thursday' }),
        friday: fields.object({
          isOpen: fields.checkbox({ label: 'Open on Friday', defaultValue: false }),
          openTime: fields.text({ label: 'Opening Time' }),
          closeTime: fields.text({ label: 'Closing Time' }),
        }, { label: 'Friday' }),
        saturday: fields.object({
          isOpen: fields.checkbox({ label: 'Open on Saturday', defaultValue: true }),
          openTime: fields.text({ label: 'Opening Time' }),
          closeTime: fields.text({ label: 'Closing Time' }),
        }, { label: 'Saturday' }),
      },
    }),
    eventsSettings: singleton({
      label: 'Events Settings',
      path: 'src/content/events-settings/',
      format: { data: 'json' },
      schema: {
        externalCalendarUrl: fields.text({
          label: 'External Calendar URL',
          description: 'The URL/embed source for the external calendar widget'
        }),
        externalCalendarEnabled: fields.checkbox({
          label: 'Show External Calendar',
          defaultValue: true
        }),
        showCmsEvents: fields.checkbox({
          label: 'Show CMS Events',
          defaultValue: true
        }),
        cmsEventsTitle: fields.text({
          label: 'CMS Events Section Title',
          defaultValue: 'Upcoming Events'
        }),
      },
    }),
  },

  collections: {
    news: collection({
      label: 'News',
      slugField: 'title',
      path: 'src/content/news/*/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishedAt: fields.date({ label: 'Published Date' }),
        updatedAt: fields.date({ label: 'Updated Date' }),
        heroImage: fields.text({ label: 'Hero Image Path', description: 'Path relative to public/ (e.g. photos/news/my-image.jpg)' }),
        heroAttribution: fields.text({ label: 'Hero Image Attribution' }),
        heroAttributionLink: fields.url({ label: 'Hero Image Attribution Link' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),

    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishedAt: fields.date({ label: 'Published Date' }),
        heroImage: fields.text({ label: 'Hero Image Path', description: 'Path relative to public/ (e.g. placeholder-hero.jpg)' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),

    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        updatedAt: fields.date({ label: 'Updated Date' }),
        heroImage: fields.text({ label: 'Hero Image Path' }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),

    events: collection({
      label: 'Events',
      slugField: 'title',
      path: 'src/content/events/*/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Title' }),
        startDate: fields.date({ label: 'Start Date' }),
        endDate: fields.date({ label: 'End Date' }),
        startTime: fields.text({ label: 'Start Time (e.g. 10:00 AM)' }),
        endTime: fields.text({ label: 'End Time' }),
        isAllDay: fields.checkbox({ label: 'All Day Event', defaultValue: false }),
        location: fields.text({ label: 'Location' }),
        description: fields.text({ label: 'Short Description', multiline: true }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
          }
        ),
        isCancelled: fields.checkbox({ label: 'Cancelled', defaultValue: false }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),

    tags: collection({
      label: 'Tags',
      slugField: 'slug',
      path: 'src/content/tags/*/',
      format: { data: 'json' },
      schema: {
        label: fields.text({ label: 'Label', description: 'Display name for the tag (e.g. "Summer Reading")' }),
        slug: fields.slug({ name: { label: 'Slug', description: 'URL-safe identifier (e.g. "summer-reading")' } }),
        description: fields.text({ label: 'Description', multiline: true }),
      },
    }),
  },
});
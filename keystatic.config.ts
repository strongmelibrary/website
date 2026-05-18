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
  },
});
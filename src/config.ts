import { stringToJSON } from "zod_utilz";
import { HoursScheduleSchema } from './schemas/HoursSchedule';
import { z } from 'zod';

// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Import JSON files directly from content collections (Keystatic singletons)
import siteInfoJson from './content/site-info/index.json';
import contactInfoJson from './content/contact-info/index.json';
import libraryHoursJson from './content/library-hours/index.json';
import navigationSettingsJson from './content/navigation-settings/index.json';
import partnerLinksJson from './content/partner-links/index.json';
import homepageSettingsJson from './content/homepage-settings/index.json';
import catalogSettingsJson from './content/catalog-settings/index.json';
import eventsSettingsJson from './content/events-settings/index.json';

// Type definitions for imported JSON content
export type SiteInfo = typeof siteInfoJson;
export type ContactInfo = typeof contactInfoJson;
export type LibraryHoursJson = typeof libraryHoursJson;
export type NavigationSettingsJson = typeof navigationSettingsJson;
export type PartnerLinksJson = typeof partnerLinksJson;
export type HomepageSettingsJson = typeof homepageSettingsJson;
export type CatalogSettingsJson = typeof catalogSettingsJson;
export type EventsSettingsJson = typeof eventsSettingsJson;

// Navigation settings from CMS
export const NAV_LINKS = navigationSettingsJson.navLinks.map(link => ({
  ...link,
  href: link.href.startsWith('/') ? link.href : `/${link.href}`,
}));

// Social links from CMS (via siteInfo)
export const SOCIAL_LINKS = siteInfoJson.socialLinks ?? [];

// Partner/Friends links from CMS
export const FRIENDS_LINKS = partnerLinksJson.links;

export const BASE_URL = import.meta.env.PUBLIC_BASE_URL
  ? `${import.meta.env.PUBLIC_BASE_URL.replace(/\/+$/, '')}/`
  : '/';

// Site info from CMS with env fallback
export const SITE_TITLE = siteInfoJson.siteTitle ?? import.meta.env.PUBLIC_SITE_TITLE;
export const SITE_DESCRIPTION = siteInfoJson.siteDescription ?? import.meta.env.PUBLIC_SITE_DESCRIPTION;
export const OWNER = siteInfoJson.owner ?? import.meta.env.PUBLIC_OWNER;
export const START_YEAR = siteInfoJson.startYear ?? import.meta.env.PUBLIC_START_YEAR;
export const MAINTENANCE_NOTICE = siteInfoJson.maintenanceNotice ?? import.meta.env.PUBLIC_MAINTENANCE_NOTICE;
export const LICENSE_NOTICE = siteInfoJson.licenseNotice ?? import.meta.env.PUBLIC_LICENSE_NOTICE;
export const TWITTER = import.meta.env.PUBLIC_TWITTER;
export const GITHUB = import.meta.env.PUBLIC_GITHUB;
export const BOOKWORM_API_URL = import.meta.env.PUBLIC_BOOKWORM_API_URL || 'https://bookworm';
export const BOOKWORM_USERNAME = import.meta.env.PUBLIC_BOOKWORM_USERNAME || 'placeholder_user';
export const BOOKWORM_PASSWORD = import.meta.env.PUBLIC_BOOKWORM_PASSWORD || ''; // Corrected: PUBLIC_ prefix is required for client-side access

// Homepage settings from CMS
export const HOMEPAGE_SETTINGS: HomepageSettingsJson = homepageSettingsJson;

// Catalog settings from CMS with env fallbacks
export const CATALOG_SETTINGS: CatalogSettingsJson = {
  electronicCatalogUrl: catalogSettingsJson.electronicCatalogUrl || import.meta.env.PUBLIC_ELECTRONIC_CATALOG_URL || 'https://catalog',
  electronicCatalogLinkText: catalogSettingsJson.electronicCatalogLinkText || import.meta.env.PUBLIC_ELECTRONIC_CATALOG_TEXT || 'Catalog',
  searchDownCtaUrl: catalogSettingsJson.searchDownCtaUrl || import.meta.env.PUBLIC_SEARCH_DOWN_CTA_URL || '',
  searchDownCtaText: catalogSettingsJson.searchDownCtaText || import.meta.env.PUBLIC_SEARCH_DOWN_CTA_TEXT || '',
};

// Convenience exports for individual catalog settings fields
export const ELECTRONIC_CATALOG_URL = CATALOG_SETTINGS.electronicCatalogUrl;
export const ELECTRONIC_CATALOG_TEXT = CATALOG_SETTINGS.electronicCatalogLinkText;
export const SEARCH_DOWN_CTA_URL = CATALOG_SETTINGS.searchDownCtaUrl;
export const SEARCH_DOWN_CTA_TEXT = CATALOG_SETTINGS.searchDownCtaText;

// Events settings from CMS
export const EVENTS_SETTINGS: EventsSettingsJson = {
  externalCalendarUrl: eventsSettingsJson.externalCalendarUrl ?? '',
  externalCalendarEnabled: eventsSettingsJson.externalCalendarEnabled ?? true,
  showCmsEvents: eventsSettingsJson.showCmsEvents ?? true,
  cmsEventsTitle: eventsSettingsJson.cmsEventsTitle ?? 'Upcoming Events',
};

// Contact info from CMS with env fallbacks
export const CONTACT_INFO: ContactInfo = {
  physicalAddress: contactInfoJson.physicalAddress ?? import.meta.env.PUBLIC_ACTUAL_ADDRESS ?? '',
  googleMapsUrl: contactInfoJson.googleMapsUrl ?? import.meta.env.PUBLIC_ADDRESS_GOOGLE_MAPS ?? '',
  mailingAddress: contactInfoJson.mailingAddress ?? import.meta.env.PUBLIC_MAILING_ADDRESS ?? '',
  phoneNumber: contactInfoJson.phoneNumber ?? import.meta.env.PUBLIC_PHONE_NUMBER ?? '',
  email: contactInfoJson.email ?? import.meta.env.PUBLIC_EMAIL ?? '',
};

// Export individual contact fields for backwards compatibility
export const PUBLIC_ACTUAL_ADDRESS = CONTACT_INFO.physicalAddress;
export const PUBLIC_ADDRESS_GOOGLE_MAPS = CONTACT_INFO.googleMapsUrl;
export const PUBLIC_MAILING_ADDRESS = CONTACT_INFO.mailingAddress;
export const PUBLIC_PHONE_NUMBER = CONTACT_INFO.phoneNumber;
export const PUBLIC_EMAIL = CONTACT_INFO.email;

// Transform library hours from day-keyed object to array format expected by existing utilities
const transformLibraryHours = (json: LibraryHoursJson): Array<{ day: string; hourOpen: string; hourClose: string }> => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const result: Array<{ day: string; hourOpen: string; hourClose: string }> = [];

  for (const day of days) {
    const dayData = json[day];
    if (dayData.isOpen) {
      result.push({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hourOpen: dayData.openTime,
        hourClose: dayData.closeTime,
      });
    }
  }

  return result;
};

export const LIBRARY_HOURS = stringToJSON()
  .pipe(z.array(HoursScheduleSchema))
  .default('[{"day":"Tuesday","hourOpen":"01:00pm","hourClose":"05:00pm"},{"day":"Wednesday","hourOpen":"01:00pm","hourClose":"07:00pm"},{"day":"Saturday","hourOpen":"10:00am","hourClose":"02:00pm"}]')
  .describe("JSON config containing API Keys for external calls to comms-bot")
  .parse(import.meta.env.PUBLIC_LIBRARY_HOURS || JSON.stringify(transformLibraryHours(libraryHoursJson)));

console.log('Config loaded:', {
  BASE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  OWNER,
  START_YEAR,
  MAINTENANCE_NOTICE,
  LICENSE_NOTICE,
  TWITTER,
  GITHUB,
  BOOKWORM_API_URL,
  SEARCH_DOWN_CTA_URL,
  SEARCH_DOWN_CTA_TEXT,
  BOOKWORM_USERNAME,
  // BOOKWORM_PASSWORD,
  ELECTRONIC_CATALOG_URL,
  ELECTRONIC_CATALOG_TEXT,
  CONTACT_INFO,
  LIBRARY_HOURS
})

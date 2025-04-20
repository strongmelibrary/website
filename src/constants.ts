import { Link, SocialLink } from './components/types';
import { BASE_URL } from './config';

export const DAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const GLOBAL_LINKS: Link[] = [
  // TODO: Determine active state based on current page?
  // Mark 'Catalog' as active on this page
  { href: BASE_URL, label: 'Home' },
  { href: BASE_URL + 'catalog', label: 'Catalog' },
  { href: BASE_URL + 'news', label: 'News' },
  { href: BASE_URL + 'events', label: 'Events', isHidden: true },
  { href: BASE_URL + 'services', label: 'Services' },
].filter((link) => !link.isHidden);

export const SOCIAL_LINKS: SocialLink[] = [
  { href: 'https://www.facebook.com/StrongMaine/', brand: 'facebook' }
]

export const FRIENDS_LINKS: Link[] = [
  {
    href: 'https://digitalmainelibrary.org/',
    label: 'Digital Maine Library',
    isExternal: true,
    topic: 'Informational'
  },
  {
    href: 'https://www.maine.gov/msl/',
    label: 'Maine State Library',
    isExternal: true,
    topic: 'Informational'
  },
  {
    href: 'https://www.maine.gov/portal',
    label: 'Maine State Government',
    isExternal: true,
    topic: 'Informational'
  },
  {
    href: 'https://www.dictionary.com/',
    label: 'Dictionary.com',
    isExternal: true,
    topic: 'Informational'
  },
  {
    href: 'https://dailybulldog.com/',
    label: 'Daily Bulldog',
    isExternal: true,
    topic: 'Newspaper'
  },
  {
    href: 'https://www.centralmaine.com/morning-sentinel/',
    label: 'The Morning Sentinel',
    isExternal: true,
    topic: 'Newspaper'
  },
  {
    href: 'https://www.sunjournal.com/',
    label: 'The Lewiston Sun Journal',
    isExternal: true,
    topic: 'Newspaper'
  },
  {
    href: 'https://www.sunjournal.com/weeklies/the-franklin-journal/',
    label: 'The Franklin Journal',
    isExternal: true,
    topic: 'Newspaper'
  },
  {
    href: 'https://www.pressherald.com/',
    label: 'The Portland Press Herald',
    isExternal: true,
    topic: 'Newspaper'
  },
  {
    href: 'https://www.mainecareercenter.com/',
    label: 'Maine Career Center',
    isExternal: true,
    topic: 'Miscellaneous'
  },
  {
    href: 'https://www.umf.maine.edu/its/location-and-hours/',
    label: 'UMF Mantor Library Hours',
    isExternal: true,
    topic: 'Libraries'
  },
  {
    href: 'https://www.phillips.lib.me.us/',
    label: 'Phillips Public Library',
    isExternal: true,
    topic: 'Libraries'
  },
  {
    href: 'https://www.farmington.lib.me.us/',
    label: 'Farmington Public Library',
    isExternal: true,
    topic: 'Libraries'
  },
  {
    href: 'https://www.facebook.com/mainehistory',
    label: 'Maine Historical Society',
    isExternal: true,
    topic: 'Miscellaneous'
  },
];
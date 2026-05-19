import type { Link, SocialLink } from './components/types';
import { BASE_URL, NAV_LINKS, SOCIAL_LINKS as CONFIG_SOCIAL_LINKS, FRIENDS_LINKS as CONFIG_FRIENDS_LINKS } from './config';

export const DAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// Re-export from config (loaded from CMS JSON)
export const GLOBAL_LINKS: Link[] = NAV_LINKS as Link[];
export const SOCIAL_LINKS: SocialLink[] = CONFIG_SOCIAL_LINKS as SocialLink[];
export const FRIENDS_LINKS: Link[] = CONFIG_FRIENDS_LINKS as Link[];
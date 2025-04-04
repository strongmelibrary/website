import { stringToJSON } from "zod_utilz";
import { HoursScheduleSchema } from './schemas/HoursSchedule';
import { z } from 'zod';

// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const BASE_URL = import.meta.env.BASE_URL || '';
export const SITE_TITLE = import.meta.env.PUBLIC_SITE_TITLE;
export const SITE_DESCRIPTION = import.meta.env.PUBLIC_SITE_DESCRIPTION;
export const OWNER = import.meta.env.PUBLIC_OWNER;
export const START_YEAR = import.meta.env.PUBLIC_START_YEAR;
export const MAINTENANCE_NOTICE = import.meta.env.PUBLIC_MAINTENANCE_NOTICE;
export const LICENSE_NOTICE = import.meta.env.PUBLIC_LICENSE_NOTICE;
export const TWITTER = import.meta.env.PUBLIC_TWITTER;
export const GITHUB = import.meta.env.PUBLIC_GITHUB;

export const LIBRARY_HOURS = stringToJSON()
  .pipe(z.array(HoursScheduleSchema))
  .default('[{"day":"Tuesday","hourOpen":"01:00pm","hourClose":"05:00pm"},{"day":"Wednesday","hourOpen":"01:00pm","hourClose":"07:00pm"},{"day":"Saturday","hourOpen":"10:00am","hourClose":"02:00pm"}]')
  .describe("JSON config containing API Keys for external calls to comms-bot")
  .parse(import.meta.env.PUBLIC_LIBRARY_HOURS)

console.log({
  BASE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  OWNER,
  START_YEAR,
  MAINTENANCE_NOTICE,
  LICENSE_NOTICE,
  TWITTER,
  GITHUB,
  LIBRARY_HOURS,
})

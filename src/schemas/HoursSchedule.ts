import { z } from 'zod';

export const HoursScheduleSchema = z.object({
  day: z.string(),
  hourOpen: z.string(),
  hourClose: z.string(),
});

// Inferred TypeScript type from the schema
export type HoursSchedule = z.infer<typeof HoursScheduleSchema>;
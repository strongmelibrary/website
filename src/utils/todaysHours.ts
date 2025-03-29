import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { HoursSchedule } from '../schemas/HoursSchedule';
import { DAY_MAP } from '../constants';

dayjs.extend(customParseFormat);

type TodayHoursInfo = {
  todaysHours: { hourOpen: string; hourClose: string } | null;
  isOpen: boolean;
  willBeOpenLater: boolean;
  remainingTime: string;
  nextOpenFromNow?: string;
};

/**
 * Helper function that takes a difference in milliseconds and returns either:
 *
 *  - A human-readable duration (e.g., "1 hour and 15 minutes"), if the candidate open time
 *    is on the same day as the current time.
 *  - A day phrase ("tomorrow at {time}", "day after tomorrow at {time}", or "next {day} at {time}")
 *    if the candidate open time falls on a later day.
 *
 * @param diffMs - The difference in milliseconds.
 * @param simple - If true, returns a simplified version when applicable.
 * @param now - Optional current dayjs instance.
 * @param candidate - Optional candidate dayjs instance for the next open time.
 * @returns A formatted string.
 */
const formatDuration = (
  diffMs: number,
  simple?: boolean,
  now?: dayjs.Dayjs,
  candidate?: dayjs.Dayjs
): string => {
  // If candidate and now are provided and the candidate is not on the same day, return day phrasing.
  if (candidate && now && !candidate.isSame(now, 'day')) {
    if (now.add(1, 'day').isSame(candidate, 'day')) {
      return `tomorrow at ${candidate.format('h:mma')}`;
    } else {
      return `${candidate.format('dddd')} at ${candidate.format('h:mma')}`;
    }
  }

  // Otherwise, compute duration in minutes/hours/days.
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const diffDays = Math.floor(totalHours / 24);
  const hoursPart = totalHours % 24;
  const minutesPart = totalMinutes % 60;

  const parts: string[] = [];
  if (diffDays > 0) {
    parts.push(`${diffDays} day${diffDays > 1 ? 's' : ''}`);
    if (simple) return `in ${parts.join(', ')}`;
  }
  if (hoursPart > 0) {
    parts.push(`${hoursPart} hour${hoursPart > 1 ? 's' : ''}`);
  }
  if (minutesPart > 0) {
    parts.push(`${minutesPart} minute${minutesPart !== 1 ? 's' : ''}`);
  }
  
  if (parts.length === 0) {
    return "now";
  }
  if (parts.length === 1) {
    return `in ${parts[0]}`;
  }
  const lastPart = parts.pop();
  if (simple) {
    parts.shift();
  }
  return `in ${parts.join(', ')} and ${lastPart}`;
};

// Helper function to calculate the next occurrence of a schedule's open time.
const getNextOccurrence = (s: HoursSchedule, now: dayjs.Dayjs): dayjs.Dayjs => {
  // Get the candidate date for the schedule's day in the current week.
  let candidate = now.day(DAY_MAP[s.day as keyof typeof DAY_MAP]);
  
  // Build the candidate open time using the candidate date and the schedule's open time.
  candidate = dayjs(`${candidate.format('YYYY-MM-DD')} ${s.hourOpen}`, 'YYYY-MM-DD hh:mma');
  
  // If the candidate open time is before the current time, add 7 days to get the next week's occurrence.
  if (candidate.isBefore(now)) {
    candidate = candidate.add(7, 'day');
  }
  return candidate;
};

/**
 * Computes today's hours info given an array of hours schedules.
 *
 * @param hours - An array of validated HoursSchedule objects.
 * @param nowOverride - Optional dayjs object to override the current time for testing.
 * @returns An object containing today's hours, whether the business is currently open,
 *          whether it will open later today, the remaining open time, and the next open time if applicable.
 */
export const getTodayHoursInfo = (hours: HoursSchedule[], nowOverride?: dayjs.Dayjs): TodayHoursInfo => {
  const now = nowOverride ?? dayjs();
  const TODAY = now.format('dddd'); // e.g., "Monday", "Tuesday", etc.
  const schedule = hours.find((s) => s.day === TODAY);
  
  // When there's no schedule for today, compute the next open occurrence.
  if (!schedule) {
    let nextCandidate: dayjs.Dayjs | null = null;
    for (const s of hours) {
      const candidate = getNextOccurrence(s, now);
      if (!nextCandidate || candidate.isBefore(nextCandidate)) {
        nextCandidate = candidate;
      }
    }
    return {
      todaysHours: null,
      isOpen: false,
      willBeOpenLater: false,
      remainingTime: "0",
      nextOpenFromNow: nextCandidate
        ? formatDuration(nextCandidate.diff(now), true, now, nextCandidate)
        : undefined,
    };
  }

  // Combine today's date with the open/close times.
  const todayDateStr = now.format('YYYY-MM-DD');
  const openTime = dayjs(`${todayDateStr} ${schedule.hourOpen}`, 'YYYY-MM-DD hh:mma');
  const closeTime = dayjs(`${todayDateStr} ${schedule.hourClose}`, 'YYYY-MM-DD hh:mma');
  
  // Business is open if current time is between openTime and closeTime.
  const isOpen = now.isAfter(openTime) && now.isBefore(closeTime);
  // Business will be open later if current time is before today's open time.
  const willBeOpenLater = now.isBefore(openTime);
  const remainingTime = isOpen ? formatDuration(closeTime.diff(now)) : "0";

  let nextOpenFromNow: string | undefined;
  
  // If the business is not open now, compute the next open time across all schedule items.
  if (!isOpen) {
    let nextCandidate: dayjs.Dayjs | null = null;
    for (const s of hours) {
      const candidate = getNextOccurrence(s, now);
      if (!nextCandidate || candidate.isBefore(nextCandidate)) {
        nextCandidate = candidate;
      }
    }
    if (nextCandidate) {
      nextOpenFromNow = formatDuration(nextCandidate.diff(now), true, now, nextCandidate);
    }
  }

  return {
    todaysHours: { hourOpen: openTime.format('h:mma'), hourClose: closeTime.format('h:mma') },
    isOpen,
    willBeOpenLater,
    remainingTime,
    nextOpenFromNow,
  };
};

export const getDateForDayTime = (dayName: string, timeStr: string) => {
  const targetDay = DAY_MAP[dayName as keyof typeof DAY_MAP];
  if (targetDay === undefined) {
    throw new Error(`Invalid day name: ${dayName}`);
  }
  
  // Start with today's date and set to the target weekday.
  let candidate = dayjs().day(targetDay);
  
  // If candidate is before the current moment, add 7 days to ensure it's in the future.
  if (candidate.isBefore(dayjs())) {
    candidate = candidate.add(7, 'day');
  }
  
  // Parse the provided time using dayjs.
  const parsedTime = dayjs(timeStr, 'hh:mma');
  
  // Set the candidate's time to the parsed hours and minutes.
  candidate = candidate.hour(parsedTime.hour()).minute(parsedTime.minute()).second(0).millisecond(0);
  
  return candidate;
};

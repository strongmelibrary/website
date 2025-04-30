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
 * Helper function that takes a difference in milliseconds and returns:
 *
 *  - A human-readable duration (e.g., "in 1 hour and 15 minutes") if on the same day.
 *  - A day phrase ("tomorrow at 3:30pm", "next Wednesday at 9:00am") if it's a future day.
 *
 * The `simple` flag, if true, will collapse to a single most‐significant unit:
 *  - >1 day ⇒ "in X days"
 *  - >0 hours ⇒ "in X hours"
 *  - else ⇒ "in Y minutes"
 */
const formatDuration = (
  diffMs: number,
  simple?: boolean,
  now?: dayjs.Dayjs,
  candidate?: dayjs.Dayjs
): string => {
  // Future‐day phrasing
  if (candidate && now && !candidate.isSame(now, 'day')) {
    if (now.add(1, 'day').isSame(candidate, 'day')) {
      return `tomorrow at ${candidate.format('h:mma')}`;
    } else {
      return `${candidate.format('dddd')} at ${candidate.format('h:mma')}`;
    }
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const diffDays = Math.floor(totalHours / 24);
  const hoursPart = totalHours % 24;
  const minutesPart = totalMinutes % 60;

  if (simple) {
    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    if (hoursPart > 0) {
      return `in ${hoursPart} hour${hoursPart > 1 ? 's' : ''}`;
    }
    if (minutesPart > 0) {
      return `in ${minutesPart} minute${minutesPart !== 1 ? 's' : ''}`;
    }
    return "now";
  }

  // Full breakdown
  const parts: string[] = [];
  if (diffDays > 0) {
    parts.push(`${diffDays} day${diffDays > 1 ? 's' : ''}`);
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
  const lastPart = parts.pop()!;
  return `in ${parts.join(', ')} and ${lastPart}`;
};

// Helper to calculate the next weekly occurrence of a schedule's open time
const getNextOccurrence = (s: HoursSchedule, now: dayjs.Dayjs): dayjs.Dayjs => {
  let candidate = now.day(DAY_MAP[s.day as keyof typeof DAY_MAP]);
  candidate = dayjs(
    `${candidate.format('YYYY-MM-DD')} ${s.hourOpen}`,
    'YYYY-MM-DD hh:mma'
  );
  if (candidate.isBefore(now)) {
    candidate = candidate.add(7, 'day');
  }
  return candidate;
};

/**
 * Computes today's hours info given an array of hours schedules.
 */
export const getTodayHoursInfo = (
  hours: HoursSchedule[],
  nowOverride?: dayjs.Dayjs
): TodayHoursInfo => {
  const now = nowOverride ?? dayjs();
  const TODAY = now.format('dddd');
  const schedule = hours.find((s) => s.day === TODAY);

  // No schedule for today ⇒ find the absolute next opening
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
        ? formatDuration(
          nextCandidate.diff(now),
            /* simple= */ false,
          now,
          nextCandidate
        )
        : undefined,
    };
  }

  // Build today's open/close times
  const todayDateStr = now.format('YYYY-MM-DD');
  const openTime = dayjs(
    `${todayDateStr} ${schedule.hourOpen}`,
    'YYYY-MM-DD hh:mma'
  );
  const closeTime = dayjs(
    `${todayDateStr} ${schedule.hourClose}`,
    'YYYY-MM-DD hh:mma'
  );

  const isOpen = now.isAfter(openTime) && now.isBefore(closeTime);
  const willBeOpenLater = now.isBefore(openTime);
  const remainingTime = isOpen
    ? formatDuration(closeTime.diff(now))
    : "0";

  let nextOpenFromNow: string | undefined;
  if (!isOpen) {
    let nextCandidate: dayjs.Dayjs | null = null;
    for (const s of hours) {
      const candidate = getNextOccurrence(s, now);
      if (!nextCandidate || candidate.isBefore(nextCandidate)) {
        nextCandidate = candidate;
      }
    }
    if (nextCandidate) {
      nextOpenFromNow = formatDuration(
        nextCandidate.diff(now),
        /* simple= */ false,
        now,
        nextCandidate
      );
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

/**
 * Given a weekday name ("Tuesday") and a time string ("3:45pm"),
 * returns the next Date matching that combination.
 */
export const getDateForDayTime = (dayName: string, timeStr: string): dayjs.Dayjs => {
  const targetDay = DAY_MAP[dayName as keyof typeof DAY_MAP];
  if (targetDay === undefined) {
    throw new Error(`Invalid day name: ${dayName}`);
  }

  // Start with today's date, shift to target weekday
  let candidate = dayjs().day(targetDay);

  // If that's in the past, roll forward a week
  if (candidate.isBefore(dayjs())) {
    candidate = candidate.add(7, 'day');
  }

  // Parse and apply the time
  const parsedTime = dayjs(timeStr, 'hh:mma');
  return candidate
    .hour(parsedTime.hour())
    .minute(parsedTime.minute())
    .second(0)
    .millisecond(0);
};

import clsx from "clsx";
import React, { useEffect } from "react";

import { getTodayHoursInfo } from '../../utils/todaysHours';
import dayjs from 'dayjs';
import type { HoursSchedule } from '../../schemas/HoursSchedule';

const TodaysHours = ({libraryHours = [], nowOverride}: {
  libraryHours?: HoursSchedule[];
  nowOverride?: dayjs.Dayjs;
}) => {
  const [todaysHoursInfo, setTodaysHoursInfo] = React.useState(
    getTodayHoursInfo(libraryHours, nowOverride)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTodaysHoursInfo(getTodayHoursInfo(libraryHours, nowOverride));
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [libraryHours, nowOverride]);

  if (libraryHours.length === 0) return null;

  const { isOpen, willBeOpenLater, todaysHours, remainingTime, nextOpenFromNow } = todaysHoursInfo;

  const hoursStr = todaysHours
    ? `${todaysHours.hourOpen} – ${todaysHours.hourClose}`
    : null;

  // Build a two-line display:
  // Line 1 (big heading): warm community phrasing
  // Line 2 (medium): today's hour range
  // Line 3 (small): countdown ("Closes in …" / "Opens tomorrow at …")
  const statusWord = isOpen ? "We're open!" : willBeOpenLater ? 'Opening soon' : "We're closed";

  // remainingTime is already "in X hours and Y minutes" from formatDuration → "We close in 48 minutes"
  // nextOpenFromNow is "tomorrow at 9:00am" / "Wednesday at 9:00am" → "We open tomorrow at 9:00am"
  const countdownLine = isOpen && remainingTime !== '0'
    ? `We close ${remainingTime}`
    : nextOpenFromNow
      ? `We open ${nextOpenFromNow}`
      : null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-1 text-center"
    >
      {nowOverride && process.env.NODE_ENV === 'development' && (
        <span className="type-body-xs opacity-60">
          ({nowOverride.format('ddd h:mma')})
        </span>
      )}

      {/* Big status word — the visual anchor of the panel */}
      <span className="type-heading-md font-heading drop-shadow-sm">
        {statusWord}
      </span>

      {/* Hours range — only shown when open or opening later today (not when closed after hours, which could be days away) */}
      {hoursStr && (isOpen || willBeOpenLater) && (
        <span className="type-heading-xxs font-heading drop-shadow-sm">
          {hoursStr}
        </span>
      )}

      {/* Countdown line */}
      {countdownLine && (
        <span className="type-body-sm opacity-80 drop-shadow-sm mt-1">
          {countdownLine}
        </span>
      )}
    </div>
  );
};

export default TodaysHours;

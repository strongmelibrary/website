import React from 'react';
import clsx from 'clsx';

import { DAY_MAP } from '../../constants';
import clock from "/illustrations/clock.svg?url";

import { getDateForDayTime } from '../../utils/todaysHours';
import type { HoursSchedule } from '../../schemas/HoursSchedule';

const DayAndHours = ({ day, hourOpen, hourClose }: {
  day: string;
  hourOpen: string;
  hourClose: string;
}) => {
  const isClosed = hourOpen === 'Closed' && hourClose === 'Closed';
  const dummyOpenDate = getDateForDayTime(day, isClosed ? '12:00pm' : hourOpen);
  const dummyCloseDate = getDateForDayTime(day, hourClose);
  const openString = dummyOpenDate.format('mm') === '00' ? dummyOpenDate.format('ha') : dummyOpenDate.format('h:mma');
  const closeString = dummyCloseDate.format('mm') === '00' ? dummyCloseDate.format('ha') : dummyCloseDate.format('h:mma');
  return (
    <div className={clsx(
      "flex",
      "justify-between",
      "items-center",
      "flex-row",
      "flex-wrap",
      "py-2",
      "border-b",
      "w-full",
      isClosed
        ? "text-[var(--color-paper)]/50 border-[var(--color-paper)]/30"
        : "text-[var(--color-paper)] border-[var(--color-paper)]/50"
    )}>
      <span className={clsx("type-heading-xxs", "p-[4px]")}>
        {dummyOpenDate.format('dddd')}
      </span>
      {!isClosed ? (
        <span className={clsx("type-heading-xs", "ml-auto")}>
          {openString} - {closeString}
        </span>
      ) : (
        <span className={clsx("type-heading-xxs")}>Closed</span>
      )}
    </div>
  );
}

export const LibraryHoursBlock = ({
  libraryHours,
}: {
  libraryHours: HoursSchedule[];
}) => {
  return (
    <div
      role="region"
      aria-label="Library Hours"
      className={clsx(
        "flex",
        "flex-col",
        "items-start",
        "justify-start",
        "gap-2",
        "p-[20px]",
        "pt-[40px]",
        "bg-[var(--color-forest)]",
        "border",
        "border-[var(--color-forest)]",
        "rounded-lg",
        "relative",
        "text-[var(--color-paper)]",
        "w-full",
      )}
    >
      {/* Bookmark triangle accent */}
      <div className={clsx(
        "w-[0px]",
        "h-[35px]",
        "bg-transparent",
        "border-solid",
        "border-[10px]",
        "border-[var(--color-terracotta)]",
        "border-b-transparent",
        "absolute",
        "top-[-5px]",
        "left-[20px]",
      )} />
      {/* Clock illustration watermark */}
      <img
        src={clock}
        alt=""
        aria-hidden="true"
        className={clsx(
          "w-[150px]",
          "h-[150px]",
          "absolute",
          "top-[40px]",
          "right-[40px]",
          "rotate-45",
          "opacity-5",
          "filter",
          "invert",
          "z-0",
        )}
      />
      <h2
        className={clsx(
          "type-heading-sm",
          "mb-2",
          "z-10",
          "text-[var(--color-paper)]",
        )}
      >
        Library Hours
      </h2>
      <div className={clsx("z-10", "w-full")}>
        {Object.entries(DAY_MAP).map(([dayName, dayNumber]) => {
          const thisDaysSchedule = libraryHours.find(schedule => schedule.day === dayName) || { day: dayName, hourOpen: 'Closed', hourClose: 'Closed' };
          return (
            <DayAndHours
              key={`${thisDaysSchedule.day}-${thisDaysSchedule.hourOpen}-${thisDaysSchedule.hourClose}`}
              day={thisDaysSchedule.day}
              hourOpen={thisDaysSchedule.hourOpen}
              hourClose={thisDaysSchedule.hourClose}
            />
          );
        })}
      </div>
    </div>
  );
}

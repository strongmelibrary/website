import React from 'react';
import clsx from 'clsx';

import { LIBRARY_HOURS } from '../../config';
import { DAY_MAP } from '../../constants';
import { getDateForDayTime } from '../../utils/todaysHours';
import clock from "../../../public/illustrations/clock.svg"; 

const DayAndHours = ({ day, hourOpen, hourClose }: {
  day: string;
  hourOpen: string;
  hourClose: string;
}) => {
  const isClosed = hourOpen === 'Closed' && hourClose === 'Closed';
  const dummyOpenDate = getDateForDayTime(day, isClosed ? '12:00pm' : hourOpen); // Use a default time if closed
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
      isClosed ? "text-info-light/50 border-info-light/50" : "text-info-light border-info-light"
    )}>
      <span className={clsx("type-heading-xxs", "p-[4px]")}>
        {dummyOpenDate.format('dddd')}
      </span>
      {!isClosed ? (
        <span className={clsx("type-heading-xs", "ml-auto")}>
          {openString} - {closeString}
        </span>
        ) : (<span className={clsx("type-heading-xxs")}>Closed</span>)}
    </div>
  );
}

export const LibraryHoursBlock = ({
  overrideLibraryHours,
}: {
  overrideLibraryHours?: typeof LIBRARY_HOURS;
}) => {
  return <div
    className={clsx(
      "flex",
      "flex-col",
      "items-start",
      "justify-start",
      "gap-2",
      "p-[20px]",
      "pt-[40px]",
      "bg-info-dark",
      "border",
      "border-neutral-300",
      "rounded-lg",
      "relative", // to position the pseudo-element
      "text-info-light",
      "w-full",
      "min-w-[300px]", // Ensure a minimum width
    )}
  >
    <div className={clsx(
      "w-[0px]",
      "h-[35px]",
      "bg-transparent",
      "border-solid",
      "border-[10px]",
      "border-accent",
      "border-bottom-[10px]",
      "border-b-transparent",
      "border-top-left-radius-[5px]",
      "border-top-right-radius-[5px]",
      "absolute",
      "top-[-5px]",
      "left-[20px]",
    )} />
    <img
      src={clock}
      alt="Clock Icon"
      className={clsx(
        "w-[150px]",
        "h-[150px]",
        "absolute",
        "top-[40px]",
        "right-[40px]",
        "rotate-45",
        "opacity-5",
        //invert colors
        "filter",
        "invert",
        "z-2", // Ensure it is behind the title
      )}
      />
    <h1
      className={clsx(
        "type-heading-sm",
        "mb-2",
        "z-10"
      )}
    >
      Library Hours
    </h1>
    <div className={clsx(
      "z-10",
      "w-full",
    )}>
      {Object.entries(DAY_MAP).map(([dayName, dayNumber]) => {
        const thisDaysSchedule = (overrideLibraryHours || LIBRARY_HOURS).find(schedule => schedule.day === dayName) || { day: dayName, hourOpen: 'Closed', hourClose: 'Closed' };
        return (<DayAndHours
          key={`${thisDaysSchedule.day}-${thisDaysSchedule.hourOpen}-${thisDaysSchedule.hourClose}`}
          day={thisDaysSchedule.day}
          hourOpen={thisDaysSchedule.hourOpen}
          hourClose={thisDaysSchedule.hourClose}
        />
      )})}
    </div>
  </div>;
}
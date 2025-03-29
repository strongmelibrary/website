import React from 'react';
import clsx from 'clsx';

import { LIBRARY_HOURS } from '../../config';
import { DAY_MAP } from '../../constants';

const DayAndHours = ({ day, hourOpen, hourClose }: {
  day: string;
  hourOpen: string;
  hourClose: string;
}) => {
  const isClosed = hourOpen === 'Closed' && hourClose === 'Closed';
  return (
    <div className={clsx("flex", "justify-between")}>
      <span className={clsx("type-body-xs")}>{day}</span>
      {!isClosed ? (<span className={clsx("type-body-sm")}>{hourOpen} - {hourClose}</span>) : (<span className={clsx("type-body-sm")}>Closed</span>)}
    </div>
  );
}

export const LibraryHoursBlock = ({
  overrideLibraryHours,
}: {
  overrideLibraryHours?: typeof LIBRARY_HOURS;
}) => {
  return <div>
    <div>
      Library Hours
    </div>
    {Object.entries(DAY_MAP).map(([dayName, dayNumber]) => {
      const thisDaysSchedule = (overrideLibraryHours || LIBRARY_HOURS).find(schedule => schedule.day === dayName) || { day: dayName, hourOpen: 'Closed', hourClose: 'Closed' };
      return (<DayAndHours
        key={`${thisDaysSchedule.day}-${thisDaysSchedule.hourOpen}-${thisDaysSchedule.hourClose}`}
        day={thisDaysSchedule.day}
        hourOpen={thisDaysSchedule.hourOpen}
        hourClose={thisDaysSchedule.hourClose}
      />
    )})}
  </div>;
}
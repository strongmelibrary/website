import clsx from "clsx";
import React, { useEffect } from "react";

import { LIBRARY_HOURS } from '../../config';
import { getTodayHoursInfo } from '../../utils/todaysHours';
import dayjs from 'dayjs';

const TodaysHours = ({nowOverride}: {
  nowOverride?: dayjs.Dayjs;
}) => {
  const [todaysHours, setTodaysHours] = React.useState(getTodayHoursInfo(LIBRARY_HOURS, nowOverride));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTodaysHours(getTodayHoursInfo(LIBRARY_HOURS, nowOverride));
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [nowOverride]);

  return (
    <div className={clsx("flex", "flex-col", "items-center", "gap-[4px]")}>
      {nowOverride && (
        <span className={clsx("type-heading-xs")}>
          (Overridden time: {nowOverride.format('dddd h:mma')})
        </span>
      )}
      <span className={clsx("type-heading-sm")}>
        The Library is {
          (!todaysHours.isOpen && todaysHours.todaysHours && !todaysHours.willBeOpenLater) ? 'now ' : ''
        }{
        todaysHours.isOpen || todaysHours.willBeOpenLater ? "open" : "closed"
        }{
          !todaysHours.todaysHours || (todaysHours.willBeOpenLater) ? ' today' : ''
        }.
      </span>
      {todaysHours.nextOpenFromNow && (
        <span className={clsx("type-heading-xs")}>
          It will open {todaysHours.nextOpenFromNow}
        </span>
      )}
      {todaysHours.isOpen && (
        <>
          <span className={clsx("type-heading-xxs")}>
            for another {todaysHours.remainingTime}
          </span>
          <span className={clsx("type-heading-xs")}>
            Today's hours are {todaysHours.todaysHours?.hourOpen} to {todaysHours.todaysHours?.hourClose}.
          </span>
        </>
      )}
      
    </div>
  );
};

export default TodaysHours;

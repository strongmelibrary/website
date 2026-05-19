import type { Meta, StoryObj } from "@storybook/react";
import TodaysHours from "./TodaysHours";
import React from "react";
import dayjs from 'dayjs';

import { LIBRARY_HOURS } from '../../config';
import { getDateForDayTime } from '../../utils/todaysHours';

const firstSchedule = LIBRARY_HOURS[0];

const earlyWithinTime = getDateForDayTime(firstSchedule.day, firstSchedule.hourOpen).add(1, 'hour').subtract(12, 'minutes');
const lateWithinTime = getDateForDayTime(firstSchedule.day, firstSchedule.hourClose).subtract(1, 'hour').add(12, 'minutes');

const outsideTimeEarly = getDateForDayTime(firstSchedule.day, firstSchedule.hourOpen).subtract(1, 'hour');
const outsideTimeLate = getDateForDayTime(firstSchedule.day, firstSchedule.hourClose).add(1, 'hour');

/**
 * TodaysHours is designed to be rendered inside the terracotta gradient panel
 * of the HeroIndex component. It inherits the panel's white text color and acts
 * as the visual centrepiece of that section.
 *
 * The decorator below reproduces that context faithfully.
 */
const meta: Meta<typeof TodaysHours> = {
  title: "Components/TodaysHours",
  component: TodaysHours,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          background: "linear-gradient(to right, var(--color-accent, #B25B36), var(--color-accent-light, #D4794F))",
          color: "white",
          padding: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          borderRadius: "0.5rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    libraryHours: LIBRARY_HOURS,
  },
};

export default meta;
type Story = StoryObj<typeof TodaysHours>;

/** Live view using the real current time */
export const Default: Story = {};

/** Snapshot of the current moment */
export const Now: Story = {
  args: {
    nowOverride: dayjs(),
  },
};

/** Library is open — early in the session (closes in many hours) */
export const InHoursEarly: Story = {
  args: {
    nowOverride: earlyWithinTime,
  },
};

/** Library is open — late in the session (closes soon) */
export const InHoursLate: Story = {
  args: {
    nowOverride: lateWithinTime,
  },
};

/** Library is closed — before opening (will open later today) */
export const OutOfHoursEarly: Story = {
  args: {
    nowOverride: outsideTimeEarly,
  },
};

/** Library is closed — after closing (opens next scheduled day) */
export const OutOfHoursLate: Story = {
  args: {
    nowOverride: outsideTimeLate,
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import TodaysHours from "./TodaysHours";
import React from "react";
import dayjs from 'dayjs';

import { LIBRARY_HOURS } from '../../config';
import { getDateForDayTime } from '../../utils/todaysHours';

const firstSchedule = LIBRARY_HOURS[0]

console.log(LIBRARY_HOURS)

const earlyWithinTime = getDateForDayTime(firstSchedule.day, firstSchedule.hourOpen).add(1, 'hour').subtract(12, 'minutes');
const lateWithinTime = getDateForDayTime(firstSchedule.day, firstSchedule.hourClose).subtract(1, 'hour').add(12, 'minutes');

const outsideTimeEarly = getDateForDayTime(firstSchedule.day, firstSchedule.hourOpen).subtract(1, 'hour');
const outsideTimeLate = getDateForDayTime(firstSchedule.day, firstSchedule.hourClose).add(1, 'hour');

const meta: Meta<typeof TodaysHours> = {
  title: "Components/TodaysHours",
  component: TodaysHours,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TodaysHours>;

export const Default: Story = { };

export const Now: Story = {
  args: {
    nowOverride: dayjs(),
  },
};

export const InHoursEarly: Story = {
  args: {
    nowOverride: earlyWithinTime,
  },
};

export const InHoursLate: Story = {
  args: {
    nowOverride: lateWithinTime,
  },
};

export const OutOfHoursEarly: Story = {
  args: {
    nowOverride: outsideTimeEarly,
  },
};

export const OutOfHoursLate: Story = {
  args: {
    nowOverride: outsideTimeLate,
  },
};
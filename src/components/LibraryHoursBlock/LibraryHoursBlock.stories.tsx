// LibraryHoursBlock.stories.tsx

import React, { useEffect, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { LibraryHoursBlock } from './LibraryHoursBlock';
import clsx from 'clsx';

// Mocking the DAY_MAP and LIBRARY_HOURS inside the Storybook context
const mockDayMap = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const meta: Meta<typeof LibraryHoursBlock> = {
  title: 'Components/LibraryHoursBlock',
  component: LibraryHoursBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  render: (args) => {
    // Simulating the LIBRARY_HOURS with the provided overrideLibraryHours
    return <div className={clsx('w-[300px]')}> <LibraryHoursBlock {...args} /></div>;
  }
};

export default meta;

type Story = StoryObj<typeof LibraryHoursBlock>;


export const Default: Story = {};

export const Overriding: Story = {
  args: {
    overrideLibraryHours: [
      { day: 'Monday', hourOpen: '9:00 AM', hourClose: '5:00 PM' },
      { day: 'Tuesday', hourOpen: '10:00 AM', hourClose: '6:00 PM' },
      { day: 'Wednesday', hourOpen: '9:00 AM', hourClose: '5:00 PM' },
      { day: 'Thursday', hourOpen: '10:30 AM', hourClose: '6:00 PM' },
      { day: 'Friday', hourOpen: '9:00 AM', hourClose: '3:00 PM' },
      { day: 'Saturday', hourOpen: 'Closed', hourClose: 'Closed' },
      { day: 'Sunday', hourOpen: 'Closed', hourClose: 'Closed' },
    ]
  }
};

export const AllClosed: Story = {
  args: {
    overrideLibraryHours: Object.keys(mockDayMap).map(day => ({
      day,
      hourOpen: 'Closed',
      hourClose: 'Closed',
    }))
  }
};

export const VariedHours: Story = {
  args: {
    overrideLibraryHours: [
      { day: 'Monday', hourOpen: '8:00 AM', hourClose: '8:00 PM' },
      { day: 'Tuesday', hourOpen: '7:30 AM', hourClose: '5:00 PM' },
      { day: 'Wednesday', hourOpen: '10:00 AM', hourClose: '4:00 PM' },
      { day: 'Thursday', hourOpen: '11:00 AM', hourClose: '3:00 PM' },
      { day: 'Friday', hourOpen: '8:00 AM', hourClose: '1:00 PM' },
      { day: 'Saturday', hourOpen: '9:00 AM', hourClose: '12:00 PM' },
      { day: 'Sunday', hourOpen: 'Closed', hourClose: 'Closed' },
    ]
  },
};

export const WideContainer: Story = {
  render: (args) => {
    // Simulating a wider container for the LibraryHoursBlock
    return (
      <div className={clsx('w-[500px]')}>
        <LibraryHoursBlock {...args} />
      </div>
    );
  }
};
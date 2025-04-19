// Calendar.stories.tsx
import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { Calendar, CalendarProps, CalendarEvent } from './Calendar'

// Base event generator for testing
const makeEvent = (id: number, day: number, overrides?: Partial<CalendarEvent>): CalendarEvent => {
  const start = new Date(2025, 9, day, 9, 0)
  const end = new Date(2025, 9, day, 10, 0)
  return {
    id: `${id}`,
    title: `Test Event ${id}`,
    description: `Description for test event ${id}`,
    start,
    end,
    location: `Test Location ${id}`,
    mapsUrl: `https://maps.google.com/?q=Test+Location+${id}`,
    ...overrides,
  }
}

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {},
}

export const CustomMonth: Story = {
  args: {
    month: new Date(2025, 9, 1), // October 2025
  },
}

export const WithCustomEvents: Story = {
  args: {
    month: new Date(2025, 9, 1),
    events: [
      makeEvent(1, 2),
      makeEvent(2, 5),
      makeEvent(3, 5),
      makeEvent(4, 12, { location: undefined, mapsUrl: undefined }), // No location
      makeEvent(5, 20, { mapsUrl: undefined }), // Location without map
    ],
  },
}

export const NoEvents: Story = {
  args: {
    month: new Date(2025, 9, 1),
    events: [],
  },
}

export const ManyEventsOnOneDay: Story = {
  args: {
    month: new Date(2025, 9, 1),
    events: Array.from({ length: 10 }, (_, i) =>
      makeEvent(i + 1, 15, { title: `Event ${i + 1}` })
    ),
  },
}

export const WithGoogleCalendarUrl: Story = {
  args: {
    month: new Date(2025, 9, 1),
    googleCalendarUrl: 'https://calendar.google.com/calendar/embed?src=test@example.com',
  },
}

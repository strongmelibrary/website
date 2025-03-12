import type { Meta, StoryObj } from "@storybook/react";
import DateTime from "./DateTime";
import React from "react";

const meta: Meta<typeof DateTime> = {
  title: "Components/DateTime",
  component: DateTime,
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: "text",
      description: "ISO date string to display in formatted form.",
      defaultValue: new Date().toISOString(),
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateTime>;

export const Default: Story = {
  args: {
    date: new Date().toISOString(),
  },
};

export const PastDate: Story = {
  args: {
    date: "2000-01-01T12:00:00Z",
  },
};

export const FutureDate: Story = {
  args: {
    date: "2050-12-31T23:59:59Z",
  },
};

export const InvalidDate: Story = {
  args: {
    date: "invalid-date",
  },
};

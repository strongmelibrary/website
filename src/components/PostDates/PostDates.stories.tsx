import { Meta, StoryObj } from "@storybook/react";
import PostDates from "./PostDates";

const meta: Meta<typeof PostDates> = {
  title: "Components/PostDates",
  component: PostDates,
  args: {
    initialDraftAt: "2024-01-01T12:00:00Z",
    publishedAt: "2024-02-01T12:00:00Z",
    updatedAt: "2024-03-01T12:00:00Z",
  },
};

export default meta;

type Story = StoryObj<typeof PostDates>;

export const Default: Story = {};

export const OnlyInitialDraft: Story = {
  args: {
    initialDraftAt: "2024-01-01T12:00:00Z",
    publishedAt: undefined,
    updatedAt: undefined,
  },
};

export const OnlyPublished: Story = {
  args: {
    initialDraftAt: undefined,
    publishedAt: "2024-02-01T12:00:00Z",
    updatedAt: undefined,
  },
};

export const OnlyUpdated: Story = {
  args: {
    initialDraftAt: undefined,
    publishedAt: undefined,
    updatedAt: "2024-03-01T12:00:00Z",
  },
};

export const NoDates: Story = {
  args: {
    initialDraftAt: undefined,
    publishedAt: undefined,
    updatedAt: undefined,
  },
};

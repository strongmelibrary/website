import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HeroIndex, HeroIndexProps } from "./HeroIndex";
import TodaysHours from '../TodaysHours/TodaysHours';

const meta: Meta<HeroIndexProps> = {
  title: "Components/HeroIndex",
  component: HeroIndex,
  tags: ["autodocs"],
  args: {
    children: (
      <TodaysHours />
    )
  }
};
export default meta;

type Story = StoryObj<HeroIndexProps>;

const samplePosts = [
  {
    title: "Exploring the Mountains",
    url: "/posts/mountains",
    date: "2025-03-14",
    category: "Adventure",
    description: "A journey through the scenic landscapes of the highlands.",
  },
  {
    title: "Tech Innovations of 2025",
    url: "/posts/tech-2025",
    date: "2025-02-28",
    category: "Technology",
    description: "An overview of groundbreaking technological advancements.",
  },
  {
    title: "Culinary Delights",
    url: "/posts/culinary-delights",
    date: "2025-01-15",
    category: "Food",
    description: "A deep dive into the world of gourmet cooking.",
  },
];

export const Default: Story = {
  args: {
    heroTagline: "Explore Beyond the Ordinary — Your Library Holds the Key.",
    posts: samplePosts,
  },
};

export const EmptyState: Story = {
  args: {
    heroTagline: "No Articles Yet",
    posts: [],
  },
};

export const WithCustomClass: Story = {
  args: {
    heroTagline: "Styled Hero Section",
    posts: samplePosts,
    className: "bg-blue-200",
  },
};

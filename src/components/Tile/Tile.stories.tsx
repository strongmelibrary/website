import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Tile from "./Tile";
import TodaysHours from "../TodaysHours/TodaysHours";
import Tag from "../Tag/Tag";

const meta: Meta<typeof Tile> = {
  title: "Components/Tile",
  component: Tile,
  parameters: {
    layout: "padded",
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Tile>;

const samplePost = {
  frontmatter: {
    publishedAt: "2024-03-12T10:00:00Z",
    title: "Understanding React Server Components",
    description:
      "A deep dive into RSC and how they change frontend development.",
    tags: ["react", "server-components", "nextjs"],
  },
  url: "/blog/react-server-components",
};

export const Default: Story = {
  args: {
    post: samplePost,
  },
};

export const NoTags: Story = {
  args: {
    post: {
      ...samplePost,
      frontmatter: {
        ...samplePost.frontmatter,
        tags: [],
      },
    },
  },
};

export const NoDescription: Story = {
  args: {
    post: {
      ...samplePost,
      frontmatter: {
        ...samplePost.frontmatter,
        description: "",
      },
    },
  },
};

export const NoTagsOrDescription: Story = {
  args: {
    post: {
      ...samplePost,
      frontmatter: {
        ...samplePost.frontmatter,
        tags: [],
        description: "",
      },
    },
  },
};

import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import PostsList from "./PostsList";
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

const meta: Meta<typeof PostsList> = {
  title: "Components/PostsList",
  component: PostsList,
  tags: ["autodocs"],
  args: {
    posts: [
      {
        ...samplePost,
      },
      {
        ...samplePost,
        frontmatter: {
          ...samplePost.frontmatter,
          title: "Understanding TypeScript",
          description:
            "A deep dive into TypeScript and how it changes frontend development.",
          tags: ["typescript", "javascript", "frontend"],
        },
        url: "/blog/understanding-typescript",
      },
      {
        ...samplePost,
        frontmatter: {
          ...samplePost.frontmatter,
          title: "Understanding React Server Components",
          description:
            "A deep dive into RSC and how they change frontend development.",
          tags: ["react", "server-components", "nextjs"],
        },
        url: "/blog/react-server-components",
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof PostsList>;

export const Default: Story = {};

export const EmptyList: Story = {
  args: {
    posts: [],
  },
};

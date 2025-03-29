import { Meta, StoryObj } from "@storybook/react";
import Tag from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text", description: "Text inside the tag" },
    href: { control: "text", description: "Optional link for the tag" },
    count: { control: "number", description: "Optional count next to the tag" },
    anchorClassName: {
      control: "text",
      description: "Custom class for the anchor element",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: "Sample Tag",
  },
};

export const WithHref: Story = {
  args: {
    children: "Clickable Tag",
    href: "https://example.com",
  },
};

export const WithCount: Story = {
  args: {
    children: "Tag with Count",
    count: 5,
  },
};

export const CustomStyled: Story = {
  args: {
    children: "Styled Tag",
    anchorClassName: "text-red-500 font-bold",
  },
};

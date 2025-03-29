import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import HeaderLink from "./HeaderLink";

const meta: Meta<typeof HeaderLink> = {
  title: "Components/HeaderLink",
  component: HeaderLink,
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
    children: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof HeaderLink>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Home",
  },
};

export const ExternalLink: Story = {
  args: {
    href: "https://example.com",
    children: "External Link",
  },
};

export const IsActive: Story = {
  args: {
    href: "#",
    children: "Active Link",
    isActive: true,
  },
};

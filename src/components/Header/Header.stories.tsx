import { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";
import { SITE_TITLE } from "../../config";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const CustomLinks: Story = {
  args: {
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
};

export const WithActive: Story = {
  args: {
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog", isActive: true },
      { href: "/contact", label: "Contact" },
    ],
  },
};

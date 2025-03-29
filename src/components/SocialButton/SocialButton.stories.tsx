import type { Meta, StoryObj } from "@storybook/react";
import { SocialButton, SocialButtonProps } from "./SocialButton";

const meta: Meta<SocialButtonProps> = {
  title: "Components/SocialButton",
  component: SocialButton,
  tags: ["autodocs"],
  argTypes: {
    brand: {
      control: "text",
      description:
        'The brand name corresponding to react-icons/tb (without "TbBrand" prefix).',
    },
    link: {
      control: "text",
      description: "The URL to open when clicking the button.",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the button.",
    },
    iconClassName: {
      control: "text",
      description: "Additional CSS classes for the icon.",
    },
  },
};

export default meta;
type Story = StoryObj<SocialButtonProps>;

export const Default: Story = {
  args: {
    brand: "github", // Example brand from react-icons/tb (TbBrandGithub)
    link: "https://github.com",
  },
};

export const TwitterCustomIconStyles: Story = {
  args: {
    brand: "twitter", // Example brand (TbBrandTwitter)
    link: "https://twitter.com",
    className: "bg-blue-500 hover:bg-blue-600",
    iconClassName: "text-error-dark",
  },
};

export const CustomButtonStyles: Story = {
  args: {
    brand: "linkedin", // Example brand (TbBrandLinkedin)
    link: "https://linkedin.com",
    className: "bg-blue-700 hover:bg-blue-800 p-4",
    iconClassName: "text-umber w-8 h-8",
  },
};

export const InvalidBrand: Story = {
  args: {
    brand: "NonExistentBrand" as any, // Invalid brand to test error handling
    link: "https://example.com",
  },
};

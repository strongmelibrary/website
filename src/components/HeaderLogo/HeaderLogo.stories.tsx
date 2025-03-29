import { Meta, StoryObj } from "@storybook/react";
import { HeaderLogo } from "./HeaderLogo";
import { SITE_TITLE } from "../../config";

const meta: Meta<typeof HeaderLogo> = {
  title: "Components/HeaderLogo",
  component: HeaderLogo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof HeaderLogo>;

export const Default: Story = {};

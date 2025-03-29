import type { Meta, StoryObj } from "@storybook/react";
import { ReadMoreBlock, ReadMoreBlockProps } from "./ReadMoreBlock";
import React from "react";

const meta: Meta<typeof ReadMoreBlock> = {
  title: "Components/ReadMoreBlock",
  component: ReadMoreBlock,
  tags: ["autodocs"],
  argTypes: {
    imageSide: { control: "radio", options: ["left", "right"] },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ReadMoreBlock>;

export const Default: Story = {
  args: {
    title: "Discover More",
    subtitle: "Learn about our latest features and updates.",
    category: "Technology",
    linkText: "Read more",
    url: "#",
    children: (
      <p>
        This is a sample content for the ReadMoreBlock. You can add any text or
        elements here to provide more information about the topic. It can be a
        brief description, an article excerpt, or any other relevant content
        that you want to showcase.
      </p>
    ),
  } as ReadMoreBlockProps,
};

export const NoCategory: Story = {
  args: {
    ...Default.args,
    category: undefined,
  } as ReadMoreBlockProps,
};
export const LargeTitle: Story = {
  args: {
    ...Default.args,
    titleSize: "lg",
  } as ReadMoreBlockProps,
};
export const SmallTitle: Story = {
  args: {
    ...Default.args,
    titleSize: "sm",
  } as ReadMoreBlockProps,
};
export const XsTitle: Story = {
  args: {
    ...Default.args,
    titleSize: "xs",
  } as ReadMoreBlockProps,
};

export const NoSubtitle: Story = {
  args: {
    ...Default.args,
    subtitle: undefined,
  } as ReadMoreBlockProps,
};
export const NoChildren: Story = {
  args: {
    ...Default.args,
    children: undefined,
  } as ReadMoreBlockProps,
};
export const NoChildrenSeparator: Story = {
  args: {
    ...Default.args,
    separator: true,
    children: undefined,
  } as ReadMoreBlockProps,
};

export const WithImageLeft: Story = {
  args: {
    ...Default.args,
    imageUrl: "https://placebear.com/600/800",
    imageAlt: "Sample Image",
    imageSide: "left",
  } as ReadMoreBlockProps,
};

export const WithImageRight: Story = {
  args: {
    ...Default.args,
    imageUrl: "https://placebear.com/900/900",
    imageAlt: "Sample Image",
    imageSide: "right",
  } as ReadMoreBlockProps,
};

export const WithoutSubtitleAndCategory: Story = {
  args: {
    title: "Just a Title",
    linkText: "Read more",
    url: "#",
  } as ReadMoreBlockProps,
};

export const LongContent: Story = {
  args: {
    ...Default.args,
    children: (
      <p>
        This is a longer content example to show how the block handles more text
        inside it. You can add additional paragraphs or even lists to make it
        more engaging.
      </p>
    ),
  } as ReadMoreBlockProps,
};

export const SmallerImageHeight: Story = {
  args: {
    ...Default.args,
    imageHeight: 200,
    children: undefined,
    imageUrl: "https://placebear.com/400/200",
  } as ReadMoreBlockProps,
};

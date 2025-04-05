import React from "react";
import * as tb from "react-icons/tb";
import { PiImageBroken } from "react-icons/pi";
import {
  capitalizeFirstLetter,
} from "../../utils/capitalize";
import { Button } from "@headlessui/react";
import clsx from "clsx";
import { BrandIcons, Brands } from '../types';

export type SocialButtonProps = {
  brand: Brands;
  link: string;
  className?: string;
  iconClassName?: string;
};

export const SocialButton = ({
  brand,
  link,
  className = "",
  iconClassName = "",
}: SocialButtonProps) => {
  let Icon = tb[`TbBrand${capitalizeFirstLetter(brand)}` as BrandIcons];
  if (!Icon) {
    console.error(`Icon not found for brand: ${brand}`);
    Icon = PiImageBroken; // Fallback icon
  }
  return (
    <Button
      className={clsx(
        "flex",
        "items-center",
        "justify-center",
        "rounded-full",
        "p-2",
        "w-[40px]",
        "h-[40px]",
        "border-1",
        "border-gray-300",
        "bg-neutral-0",
        "hover:bg-accent",
        "hover:border-accent",
        "transition-colors",
        "duration-200",
        "cursor-pointer",
        "grow-0",
        "group",
        className,
      )}
      onClick={() => window.open(link, "_blank")}
      aria-label={`Link to ${brand}`}
      title={`Link to ${brand}`}
    >
      <Icon
        className={clsx(
          "w-[24px]",
          "h-[24px]",
          "text-info",
          "dark:text-info-light",
          "group-hover:text-neutral-0", // Change color on hover
          "transition-colors",
          "duration-200",
          iconClassName,
        )}
      />
    </Button>
  );
};

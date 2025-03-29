import React from "react";
import * as tb from "react-icons/tb";
import { PiImageBroken } from "react-icons/pi";
import {
  capitalizeFirstLetter,
  OnlyWithPrefix,
  RemovePrefixAndLowercase,
} from "../../utils/capitalize";
import { Button } from "@headlessui/react";
import clsx from "clsx";

type BrandIcons = OnlyWithPrefix<keyof typeof tb, "TbBrand">;
export type Brands = RemovePrefixAndLowercase<BrandIcons, "TbBrand">;

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
        "border-2",
        "border-gray-300",
        "bg-neutral-0",
        "hover:bg-accent",
        "hover:border-accent",
        "transition-colors",
        "duration-200",
        "cursor-pointer",
        className,
      )}
      onClick={() => window.open(link, "_blank")}
      aria-label={`Link to ${brand}`}
      title={`Link to ${brand}`}
    >
      <Icon
        className={clsx(
          "w-6",
          "h-6",
          "text-gray-700",
          "dark:text-gray-200",
          iconClassName,
        )}
      />
    </Button>
  );
};

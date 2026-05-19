import React from "react";
import * as tb from "react-icons/tb";
import { PiImageBroken } from "react-icons/pi";
import { capitalizeFirstLetter } from "../../utils/capitalize";
import clsx from "clsx";
import type { BrandIcons, Brands } from '../types';

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
    Icon = PiImageBroken;
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit our ${brand} page`}
      title={`Visit our ${brand} page`}
      className={clsx(
        "flex",
        "items-center",
        "justify-center",
        "rounded-full",
        "p-2",
        "w-[40px]",
        "h-[40px]",
        "border",
        "border-[var(--color-stone)]/50",
        "bg-[var(--color-paper)]",
        "hover:bg-[var(--color-terracotta)]",
        "hover:border-[var(--color-terracotta)]",
        "transition-colors",
        "duration-200",
        "grow-0",
        "group",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-[var(--color-forest)]",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={clsx(
          "w-[24px]",
          "h-[24px]",
          "text-[var(--color-charcoal)]",
          "group-hover:text-white",
          "transition-colors",
          "duration-200",
          iconClassName,
        )}
      />
    </a>
  );
};

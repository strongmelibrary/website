import React from "react";
import clsx from "clsx";
import { HiArrowRight } from "react-icons/hi2";

export interface ReadMoreBlockBase {
  title: string;
  subtitle?: string;
  category?: string;
  children?: React.ReactNode;
  linkText: string;
  url: string;
  className?: string;
  separator?: boolean;
  titleSize?: "xs" | "sm" | "md" | "lg";
  imageUrl?: undefined;
  imageAlt?: undefined;
  imageSide?: undefined;
  imageHeight?: undefined;
}

export type ReadMoreBlockWithImage = Omit<
  ReadMoreBlockBase,
  "imageUrl" | "imageSide" | "imageAlt" | "imageHeight"
> & {
  imageUrl: string;
  imageAlt: string;
  imageSide?: "left" | "right";
  imageHeight?: number;
};

export type ReadMoreBlockProps = ReadMoreBlockBase | ReadMoreBlockWithImage;

export const ReadMoreBlock = ({
  title,
  subtitle,
  category,
  children,
  linkText,
  url,
  imageUrl,
  imageAlt,
  imageSide = "left",
  imageHeight = 400,
  className = "",
  separator,
  titleSize = "md",
}: ReadMoreBlockProps) => {
  return (
    <div
      style={{
        height: imageUrl ? `${imageHeight}px` : "auto",
      }}
      className={clsx(
        "flex",
        "flex-row",
        "md:flex-row",
        "items-center",
        "gap-4",
        "w-full",
        "border-0",
        className,
      )}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt}
          className={clsx(
            {
              "order-2": imageSide === "left",
              "order-1": imageSide === "right",
            },
            "w-1/2",
            "h-full",
            "max-w-[auto]",
            "object-cover",
          )}
        />
      )}
      <div
        className={clsx("flex", "flex-col", "py-4", {
          "order-1": imageUrl && imageSide === "left",
          "order-2": imageUrl && imageSide === "right",
          "w-1/2": imageUrl,
          "w-full": !imageUrl,
        })}
      >
        {category && (
          <span className="type-caps text-[var(--color-terracotta)] mb-1">{category}</span>
        )}
        <a
          className={clsx(
            "text-[var(--color-charcoal)]",
            "hover:text-[var(--color-terracotta)]",
            "transition-colors",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[var(--color-forest)]",
            "rounded-sm",
            {
              "type-heading-xs": titleSize === "xs",
              "type-heading-sm": titleSize === "sm",
              "type-heading-md": titleSize === "md",
              "type-heading-lg": titleSize === "lg",
              "pointer-events-none": separator,
            }
          )}
          href={url}
        >
          {title}
        </a>
        {separator && (
          <div className={clsx("w-full", "relative")}>
            <hr className={clsx("pb-[16px]", "mt-[16px]", "border-[var(--color-stone)]/30")} />
            <div
              className={clsx(
                "absolute",
                "top-1/2",
                "translate-y-[-50%]",
                "left-0",
                "w-[40px]",
                "h-[4px]",
                "bg-[var(--color-terracotta)]",
              )}
            />
          </div>
        )}
        {subtitle && (
          <p className="type-body-sm text-[var(--color-charcoal)]/70 mt-1">{subtitle}</p>
        )}
        {children && <div className="mt-2">{children}</div>}

        <a
          href={url}
          className={clsx(
            "mt-4",
            "inline-flex",
            "items-center",
            "gap-1",
            "text-[var(--color-terracotta)]",
            "hover:text-[var(--color-terracotta-dark)]",
            "hover:underline",
            "transition-colors",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[var(--color-forest)]",
            "rounded-sm",
            {
              "type-body-xs": titleSize === "xs",
              "type-body-md": titleSize !== "xs",
            }
          )}
        >
          {linkText}
          <HiArrowRight aria-hidden="true" className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

import React from "react";
import clsx from "clsx";
import dayjs from 'dayjs';

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
          <span className="text-sm text-gray-500 type-caps">{category}</span>
        )}
        <a
          className={clsx({
            "type-heading-xs": titleSize === "xs",
            "type-heading-sm": titleSize === "sm",
            "type-heading-md": titleSize === "md",
            "type-heading-lg": titleSize === "lg",
            "pointer-events-none": separator
          })}
          href={url}
        >
          {title}
        </a>
        {separator && (
          <div className={clsx("w-full", "relative")}>
            <hr className={clsx("pb-[16px]", "mt-[16px]")} />
            <div
              className={clsx(
                "absolute",
                "top-1/2",
                "translate-y-[-50%]",
                "left-0",
                "w-[40px]",
                "h-[4px]",
                "bg-accent",
              )}
            />
          </div>
        )}
        {subtitle && <p className="text-gray-700">{subtitle}</p>}
        {children && <div className="mt-2">{children}</div>}
        {/* Link to the full post */}

        <a href={url} className={clsx(
          "mt-4",
          "inline-block",
          "text-accent",
          "hover:underline",
          {
            "type-body-xs": titleSize === "xs",
            "type-body-md": titleSize !== "xs",
          }
          )}>
          {linkText}
        </a>
      </div>
    </div>
  );
};

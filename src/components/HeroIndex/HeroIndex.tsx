import React from "react";
import clsx from "clsx";
import { ReadMoreBlock } from "../ReadMoreBlock/ReadMoreBlock";
import { Button, Input } from '@headlessui/react';
import { PiMagnifyingGlassBold } from 'react-icons/pi';

export interface Post {
  title: string;
  url: string;
  date: string;
  category?: string;
  description: string;
}

export interface HeroIndexProps {
  className?: string;
  posts?: Post[];
  heroTagline?: string;
  children?: React.ReactNode;
}

export const HeroIndex = ({
  className = "",
  posts,
  heroTagline,
  children,
}: HeroIndexProps) => {
  return (
    <div
      className={clsx(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "bg-gray-100",
        "rounded-lg",
        "shadow-md",
        "w-full",
        className
      )}
    >
      {/* Grid layout for hero tagline and posts */}
      <div className={clsx("grid", "lg:grid-cols-3", "grid-cols-1", "w-full")}>
        <div
          className={clsx(
            "lg:col-span-2",
            "col-span-1",
            "flex",
            "flex-col",
            "justify-end",
            "relative",
            "lg:h-auto",
            "h-[400px]",
          )}
        >
          <img
            src="/photos/unsplash/annie-spratt-wseixWvrsD4-unsplash.jpg"
            alt="Hero Image"
            className={clsx(
              "w-full",
              "h-full",
              "object-cover",
              "absolute",
              "top-0",
              "left-0",
              "z-1"
            )}
          />
          <span className={clsx(
            "type-heading-sm",
            "text-neutral-0",
            "p-5",
            "z-2")}>
            {heroTagline}
          </span>
        </div>
        <div
          className={clsx(
            "col-span-1",
            "flex",
            "flex-col",
            "items-start",
            "justify-start",
            "gap-2"
          )}
        >
          {posts?.map((post) => (
            <ReadMoreBlock
              separator
              key={post.url}
              title={post.title}
              titleSize="sm"
              subtitle={post.description}
              category={post.category}
              url={post.url}
              linkText="Read more"
            />
          ))}
        </div>
      </div>

      {/* Search row below */}
      <div
        className={clsx(
          "grid", 
          "lg:grid-cols-3",
          "grid-cols-1",
          "items-start",
          "justify-start",
          "w-full",
        )}
      >
        <div
          className={clsx(
            "flex",
            "flex-row",
            "items-start",
            "justify-start",
            "gap-2",
            "lg:col-span-2",
            "col-span-1",
            "h-full",
            "py-10",
            "px-4",
            "bg-neutral-100"
          )}
        >
          <Input
            type="text"
            placeholder="Search..."
            className={clsx(
              "h-full",
              "p-2",
              "border-b",
              "flex-grow",
              "text-neutral-0",
              "border-neutral-0",
              "focus:outline-none",
              "focus:ring-2",
              "focus:ring-offset-2",
            )}
          />
          <Button
            className={clsx(
              "px-4",
              "py-2",
              "bg-transparent",
              "text-white",
              "rounded-lg",
              "hover:bg-neutral-80",
              "transition-colors",
              "duration-200",
              "cursor-pointer",
            )}
          >
            <PiMagnifyingGlassBold />
          </Button>
        </div>
        <div
          className={clsx(
            "flex",
            "flex-row",
            "items-center",
            "justify-center",
            "gap-2",
            "col-span-1",
            "lg:h-full",
            "h-auto",
            "w-full",
            "py-10",
            "bg-accent",
            "text-neutral-0",
          )}
        >
          {children}
          </div>
      </div>
    </div>
  );
};

import React, { useState, useCallback } from "react";
import clsx from "clsx";
import { ReadMoreBlock } from "../ReadMoreBlock/ReadMoreBlock";
import { Button, Input } from '@headlessui/react';
import { PiMagnifyingGlassBold } from 'react-icons/pi';

import heroImage from "../../../public/photos/unsplash/annie-spratt-unsplash.jpg"; 
import flyingBooks from "../../../public/illustrations/flying_books.svg"; 

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
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchTerm.trim())}&page=1`;
    }
  }, [searchTerm]);
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
            src={heroImage}
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
            "gap-2",
            "px-[16px]",
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
            "items-center",
            "justify-start",
            "gap-2",
            "lg:col-span-2",
            "col-span-1",
            "h-full",
            "py-10",
            "px-4",
            "bg-info-dark"
          )}
        >
          {/* Client-side search form with JavaScript redirect */}
          <div className="flex flex-row items-center justify-start gap-2 w-full">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search the catalog..."
              className={clsx(
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
              onClick={handleSearch}
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
        </div>
        <div
          className={clsx(
            "relative",
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
            // bg gradient accent -> accent-light
            "bg-gradient-to-r",
            "from-accent",
            "to-accent-light",
            "text-neutral-0",
          )}
        >
          <img src={flyingBooks} alt="Flying Books" className={clsx(
            "w-full", 
            "h-full", 
            "object-contain",
            "absolute",
            "top-0",
            "left-0",
            "z-0",
            )} />
          <div className={clsx(
            "relative",
            "z-10",
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useCallback } from "react";
import clsx from "clsx";
import { ReadMoreBlock } from "../ReadMoreBlock/ReadMoreBlock";
import { PiMagnifyingGlassBold } from 'react-icons/pi';

import heroImage from "/photos/unsplash/annie-spratt-unsplash.jpg?url";
import flyingBooks from "/illustrations/flying_books.svg?url";

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
  heroImagePath?: string;
  heroImageAlt?: string;
  children?: React.ReactNode;
}

export const HeroIndex = ({
  className = "",
  posts,
  heroTagline,
  heroImagePath,
  heroImageAlt = "The Strong, Me Public Library",
  children,
}: HeroIndexProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use provided heroImagePath or fall back to static import
  const displayImage = heroImagePath ? `/${heroImagePath}` : heroImage;
  
  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchTerm.trim())}&page=1`;
    }
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={clsx(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "bg-[var(--color-paper)]",
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
            src={displayImage}
            alt={heroImageAlt}
            className={clsx(
              "w-full",
              "h-full",
              "object-cover",
              "absolute",
              "top-0",
              "left-0",
              "z-10"
            )}
          />
          {heroTagline && (
            <span className={clsx(
              "type-heading-sm",
              "text-white",
              "drop-shadow-lg",
              "p-5",
              "z-20",
              "relative",
            )}>
              {heroTagline}
            </span>
          )}
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
            "bg-[var(--color-forest)]",
          )}
        >
          {/* Client-side search form */}
          <div className="flex flex-row items-center justify-start gap-2 w-full">
            <label htmlFor="hero-search" className="sr-only">Search the catalog</label>
            <input
              id="hero-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search the catalog..."
              className={clsx(
                "p-2",
                "border-b",
                "flex-grow",
                "min-h-[44px]",
                "text-white",
                "bg-transparent",
                "border-white/60",
                "placeholder:text-white/60",
                "focus:outline-none",
                "focus-visible:border-white",
                "focus-visible:ring-0",
              )}
            />
            <button
              onClick={handleSearch}
              aria-label="Search catalog"
              className={clsx(
                "px-4",
                "py-2",
                "min-h-[44px]",
                "bg-transparent",
                "text-white",
                "rounded-lg",
                "hover:bg-white/20",
                "transition-colors",
                "duration-200",
                "cursor-pointer",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-2",
                "focus-visible:outline-white",
              )}
            >
              <PiMagnifyingGlassBold aria-hidden="true" />
            </button>
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
            "bg-gradient-to-r",
            "from-accent",
            "to-accent-light",
            "text-white",
          )}
        >
          <img
            src={flyingBooks}
            alt=""
            aria-hidden="true"
            className={clsx(
              "w-full", 
              "h-full", 
              "object-contain",
              "absolute",
              "top-0",
              "left-0",
              "z-0",
            )}
          />
          <div className={clsx("relative", "z-10")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

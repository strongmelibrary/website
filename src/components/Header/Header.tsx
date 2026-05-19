import HeaderLink from "../HeaderLink/HeaderLink";
import React, { useState } from "react";
import { BASE_URL } from "../../config";
import { HeaderLogo } from "../HeaderLogo/HeaderLogo";
import clsx from "clsx";
import { SocialButton } from "../SocialButton/SocialButton";
import type { Link, SocialLink } from '../types';
import { GLOBAL_LINKS, SOCIAL_LINKS } from '../../constants';
import { HiBars3, HiXMark } from "react-icons/hi2";

export interface HeaderProps {
  title?: string;
  activePage?: string;
  links?: Link[];
  socialLinks?: SocialLink[];
}

const _base = import.meta.env.BASE_URL;
export const DEFAULT_LINKS: Link[] = [
  { href: `${_base}news`, label: "News" },
  { href: `${_base}events`, label: "Events" },
  { href: `${_base}services`, label: "Services" },
  { href: `${_base}catalog`, label: "Catalog" },
  { href: `${_base}about`, label: "About" },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [];

export const Header = ({
  title,
  activePage,
  links = DEFAULT_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur-sm flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-[var(--color-stone)]/30 bg-[var(--color-paper)]/95 supports-backdrop-blur:bg-[var(--color-paper)]/60">
      <header className="max-w-8xl mx-auto">
        <div
          className={clsx(
            "flex",
            "flex-row",
            "items-center",
            "py-4",
            "border-b",
            "gap-4",
            "border-[var(--color-stone)]/30",
            "lg:px-8",
            "lg:border-0",
            "mx-4",
            "lg:mx-0",
          )}
        >
          <a href={BASE_URL} aria-label="Strong, Me Public Library — Home">
            <HeaderLogo />
          </a>
          <div className="flex-grow" />

          {/* Desktop navigation links */}
          <nav aria-label="Main navigation" className="hidden md:flex space-x-4 font-semibold text-base md:text-md text-[var(--color-charcoal)]">
            {links.map((link) => (
              <HeaderLink
                key={link.href}
                href={link.href}
                isActive={link.isActive}
              >
                {link.label}
              </HeaderLink>
            ))}
          </nav>
          {/* Desktop social links */}
          <nav aria-label="Social media links" className="hidden md:flex space-x-1 font-semibold text-base md:text-md">
            {socialLinks.map((link) => (
              <SocialButton
                key={link.href}
                link={link.href}
                brand={link.brand}
              />
            ))}
          </nav>

          {/* Mobile: Hamburger toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={clsx(
                "flex",
                "items-center",
                "justify-center",
                "w-10",
                "h-10",
                "rounded",
                "text-[var(--color-charcoal)]",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-2",
                "focus-visible:outline-[var(--color-forest)]",
                "cursor-pointer",
              )}
            >
              {isMenuOpen ? (
                <HiXMark aria-hidden="true" className="w-6 h-6" />
              ) : (
                <HiBars3 aria-hidden="true" className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation dropdown */}
        <nav
          id="mobile-menu"
          aria-label="Main navigation"
          className={clsx(
            "md:hidden",
            "transition-all",
            "duration-300",
            "bg-[var(--color-forest-dark,#2d5040)]",
            isMenuOpen ? "block" : "hidden",
          )}
        >
          {/* Social links placed at the top of the mobile dropdown */}
          {socialLinks.length > 0 && (
            <div className="px-4 pt-4 pb-2">
              <div className="flex space-x-2 font-semibold text-base">
                {socialLinks.map((link) => (
                  <SocialButton
                    key={link.href}
                    link={link.href}
                    brand={link.brand}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Navigation links */}
          <ul className="flex flex-col space-y-1 px-4 py-4 font-semibold text-base">
            {links.map((link) => (
              <li key={link.href}>
                <HeaderLink
                  href={link.href}
                  isActive={link.isActive}
                  className="block min-h-[44px] flex items-center text-white border-white/30"
                >
                  {link.label}
                </HeaderLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;

export const ConfiguredHeader = () => (
  <Header links={GLOBAL_LINKS}
    socialLinks={SOCIAL_LINKS}
  />
);

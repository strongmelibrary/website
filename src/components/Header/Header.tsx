import HeaderLink from "../HeaderLink/HeaderLink";
import React from "react";
import { BASE_URL, SITE_TITLE } from "../../config";
import { HeaderLogo } from "../HeaderLogo/HeaderLogo";
import clsx from "clsx";
import { SocialButton } from "../SocialButton/SocialButton";
import { Link, SocialLink } from '../types';
import { GLOBAL_LINKS, SOCIAL_LINKS } from '../../constants';

export interface HeaderProps {
  title?: string;
  activePage?: string;
  links?: Link[];
  socialLinks?: SocialLink[];
}

export const DEFAULT_LINKS: Link[] = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { href: "#", brand: "facebook" },
  { href: "#", brand: "twitter" },
  { href: "#", brand: "tiktok" },
  { href: "#", brand: "instagram" },
];

export const Header = ({
  title,
  activePage,
  links = DEFAULT_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
}: HeaderProps) => {
  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur-sm flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
      <header className="max-w-8xl mx-auto">
        {/* Hidden checkbox for mobile nav toggle */}
        <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />

        <div
          className={clsx(
            "flex",
            "flex-row",
            "items-center",
            "py-4",
            "border-b",
            "gap-4",
            "border-slate-900/10",
            "lg:px-8",
            "lg:border-0",
            "dark:border-slate-300/10",
            "mx-4",
            "lg:mx-0",
          )}
        >
          <a href={BASE_URL}>
            <HeaderLogo />
          </a>
          <div className="flex-grow" />

          {/* Desktop navigation links */}
          <nav className="hidden md:flex space-x-4 font-semibold text-base md:text-md text-slate-900 dark:text-slate-100">
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
          <nav className="hidden md:flex space-x-1 font-semibold text-base md:text-md text-slate-900 dark:text-slate-100">
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
            <label htmlFor="mobile-menu-toggle" className="cursor-pointer">
              <span className="block w-6 h-0.5 bg-slate-900 my-1 transition-transform duration-300 transform peer-checked:rotate-45 peer-checked:translate-y-2"></span>
              <span className="block w-6 h-0.5 bg-slate-900 my-1 transition-opacity duration-300 peer-checked:opacity-0"></span>
              <span className="block w-6 h-0.5 bg-slate-900 my-1 transition-transform duration-300 transform peer-checked:-rotate-45 peer-checked:-translate-y-2"></span>
            </label>
          </div>
        </div>

        {/* Mobile navigation dropdown (only visible when toggled) */}
        <nav className="peer-checked:block hidden md:hidden transition-all duration-300">
          {/* Social links placed at the top of the mobile dropdown */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex space-x-2 font-semibold text-base text-slate-900 dark:text-slate-100">
              {socialLinks.map((link) => (
                <SocialButton
                  key={link.href}
                  link={link.href}
                  brand={link.brand}
                />
              ))}
            </div>
          </div>
          {/* Navigation links */}
          <ul className="flex flex-col space-y-2 px-4 pb-4 font-semibold text-base text-slate-900 dark:text-slate-100">
            {links.map((link) => (
              <li key={link.href}>
                <HeaderLink href={link.href} isActive={link.isActive}>
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

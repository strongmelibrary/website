import {
  GITHUB,
  LICENSE_NOTICE,
  MAINTENANCE_NOTICE,
  OWNER,
  START_YEAR,
  TWITTER,
} from "../../config";
import React from "react";
import clsx from "clsx";
import { HeaderLogo } from '../HeaderLogo/HeaderLogo';

import {
  PUBLIC_ACTUAL_ADDRESS,
  PUBLIC_ADDRESS_GOOGLE_MAPS,
  PUBLIC_MAILING_ADDRESS,
  PUBLIC_PHONE_NUMBER,
  PUBLIC_EMAIL
} from "../../config";
import { TbExternalLink } from 'react-icons/tb';
import { Link, SocialLink } from '../types';
import { SocialButton } from '../SocialButton/SocialButton';

export interface FooterProps {
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

const Footer = ({
  links = DEFAULT_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
}: FooterProps) => {
  return (
    <footer className={clsx(
      "py-8",
      "mt-24",
      "w-full",
      "bg-paper",
      "grid",
      "lg:grid-cols-5",
      "grid-cols-1",
      "gap-y-16",
      "mx-auto",
      "pb-32"
    )}>
      <div />
      <div className={clsx(
        "flex",
        "flex-col",
        "lg:items-start",
        "items-center",
        "justify-center",
        "text-center",
      )}>
        <HeaderLogo />

        <span className={clsx(
          "type-heading-xxs",
          "px-6",
          "font-semibold",
          "text-slate-900",
          "dark:text-slate-100",
        )}>
          Contact
        </span>
        <a
          className={clsx(
            "text-sm",
            "mt-2",
            "px-8",
            "max-w-md",
            "flex",
            "flex-row",
            "gap-2",
            "items-start",
            "text-left"
          )}
          href={PUBLIC_ADDRESS_GOOGLE_MAPS}
          target="_blank"
        >
          {PUBLIC_ACTUAL_ADDRESS || 'Address not available'}
          <TbExternalLink className="inline-block" />
        </a>
        <div className={clsx(
          "text-slate-600",
          "text-sm",
          "mt-2",
          "px-8",
          "max-w-md",
          "flex",
          "flex-row",
          "items-start",
          "text-left"
        )}>
          Mailing: {PUBLIC_MAILING_ADDRESS || 'Address not available'}
        </div>
        <div className={clsx(
          "text-slate-600",
          "text-sm",
          "mt-2",
          "px-8",
          "max-w-md",
          "flex",
          "flex-row",
          "items-start",
          "text-left"
        )}>
          Phone: <a
            href={`tel:${PUBLIC_PHONE_NUMBER}`}
          >{PUBLIC_PHONE_NUMBER || '555-555-5555'}</a>
        </div>
        <div className={clsx(
          "text-slate-600",
          "text-sm",
          "mt-2",
          "px-8",
          "max-w-md",
          "flex",
          "flex-row",
          "items-start",
          "text-left"
        )}>
          Email: <a
            href={`mailto:${PUBLIC_EMAIL}`}
          >{PUBLIC_EMAIL || 'example@example.com'}</a>
        </div>
      </div>
      <div
        className={clsx(
          "flex",
          "flex-col",
          "lg:items-start",
          "items-center",
          "justify-end",
          "gap-2",
          "px-8",
        )}
      >
        <span className={clsx(
          "type-heading-xxs",
          "px-6",
          "font-semibold",
          "text-slate-900",
          "dark:text-slate-100",
        )}>
          Navigation
        </span>
        {links.map((link) => (
          <a
            className={clsx(
              "text-sm",
              "px-8",
              "max-w-md",
              "items-center",
            )}
            href={link.href}
          >
            {link.label}
          </a>
        ))}

      </div>
      <div
        className={clsx(
          "flex",
          "flex-col",
          "font-light",
          "text-sm",
          "justify-end",
          "lg:items-start",
          "items-center",
          "h-full",
        )}
      >

        <span className={clsx(
          "type-heading-xxs",
          "px-6",
          "font-semibold",
          "text-slate-900",
          "dark:text-slate-100",
        )}>
          Social
        </span>
        <nav className="flex space-x-1 px-8 mb-16 font-semibold text-base text-md text-slate-900 dark:text-slate-100">
          {socialLinks.map((link) => (
            <SocialButton
              key={link.href}
              link={link.href}
              brand={link.brand}
            />
          ))}
        </nav>
        <p className={clsx(
          "m-0",
        )}>
          Copyright © {START_YEAR} - {new Date().getFullYear()}
        </p>
        <p className={clsx(
          "m-0",
        )}>
          {OWNER}.
        </p>
        {MAINTENANCE_NOTICE && <p className={clsx(
          "mx-32",
          "mt-2",
          "lg:mt-6",
          "mb-8"
        )}>
          {MAINTENANCE_NOTICE}
        </p>}
      </div>
      <div />

    </footer>
  );
};

export default Footer;

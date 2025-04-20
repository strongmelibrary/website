import {
  BASE_URL,
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
import { FRIENDS_LINKS, GLOBAL_LINKS, SOCIAL_LINKS } from '../../constants';

export interface FooterProps {
  links?: Link[];
  friendsLinks?: Link[];
  socialLinks?: SocialLink[];
}

export const DEFAULT_LINKS: Link[] = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export const DEFAULT_FRIENDS_LINKS: Link[] = [
  {
    href: 'https://example.com',
    label: 'Friend 1',
    isExternal: true,
    topic: 'Informational',
  },
  {
    href: 'https://example.com',
    label: 'Friend 2',
    isExternal: true,
    topic: 'Informational',
  },
  {
    href: 'https://example.com',
    label: 'Friend 3',
    isExternal: true,
    topic: 'Informational',
  },
  {
    href: 'https://example.com',
    label: 'Friend 4',
    isExternal: true,
    topic: 'Informational',
  },
  {
    href: 'https://example.com',
    label: 'Friend 5',
    isExternal: true,
    topic: 'Libraries',
  },
  {
    href: 'https://example.com',
    label: 'Friend 6',
    isExternal: true,
    topic: 'Libraries',
  },
  {
    href: 'https://example.com',
    label: 'Friend 7',
    isExternal: true,
    topic: 'Libraries',
  },
  {
    href: 'https://example.com',
    label: 'Friend 8',
    isExternal: true,
    topic: 'Newspaper',
  },
  {
    href: 'https://example.com',
    label: 'Friend 9',
    isExternal: true,
    topic: 'Newspaper',
  },
  {
    href: 'https://example.com',
    label: 'Friend 10',
    isExternal: true,
    topic: 'Newspaper',
  },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { href: "#", brand: "facebook" },
  { href: "#", brand: "twitter" },
  { href: "#", brand: "tiktok" },
  { href: "#", brand: "instagram" },
];

const Footer = ({
  links = DEFAULT_LINKS,
  friendsLinks = DEFAULT_FRIENDS_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
}: FooterProps) => {
  // get friend link topics
  const friendLinkTopics = friendsLinks.reduce((acc, link) => {
    if (link.topic && !acc.includes(link.topic)) {
      acc.push(link.topic);
    }
    return acc;
  }, [] as string[]);

  return (
    <footer className={clsx(
      "py-8",
      "mt-24",
      "w-full",
      "bg-paper",
      "grid",
      "md:grid-cols-8",
      "grid-cols-1",
      "gap-y-[16px]",
      "mx-auto",
      "pb-32"
    )}>

      <div className={clsx(
        "col-span-0",
        "md:col-span-1",
      )}/>
      <div className={clsx(
        "col-span-1",
        "md:col-span-3",
        "flex",
        "flex-col",
        "items-center",
        "md:items-start",
      )}>
        <HeaderLogo />
      </div>
      <div className={clsx(
        "col-span-0",
        "md:col-span-4",
      )}/>
      <div className={clsx(
        "col-span-0",
        "md:col-span-1",
      )}/>
      <div className={clsx(
        "flex",
        "flex-col",
        "md:col-span-2",
        "md:items-start",
        "items-center",
        "justify-start",
        "text-center",
        "px-8",
      )}>
        

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
          "md:items-start",
          "items-center",
          "justify-start",
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
          "md:col-span-2",
          "md:items-start",
          "items-center",
          "md:text-left",
          "text-center",
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
          Friends & Other Links
        </span>
        {friendLinkTopics.map((topic) => (
          <div key={topic} className="flex flex-col">
            <span className={clsx(
              "text-sm",
              "px-8",
              "max-w-md",
              "items-center",
              "font-semibold",
            )}>
              {topic}
            </span>
            {friendsLinks
              .filter((link) => link.topic === topic)
              .map((link) => (
                <a
                  key={link.href}
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
        ))}

      </div>
      <div
        className={clsx(
          "flex",
          "flex-col",
          "font-light",
          "text-sm",
          "justify-start",
          "md:items-start",
          "items-center",
          "h-full",
          "px-6",
        )}
      >

        <span className={clsx(
          "type-heading-xxs",
          "font-semibold",
          "text-slate-900",
          "dark:text-slate-100",
        )}>
          Social
        </span>
        <nav className="flex space-x-1 px-2 mb-16 font-semibold text-base text-md text-slate-900 dark:text-slate-100">
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
          <a href={BASE_URL + 'attribution'} className="underline">
            Attribution Page
          </a>
        </p>
        <p className={clsx(
          "mt-1",
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
          "md:mt-6",
          "mb-8"
        )}>
          {MAINTENANCE_NOTICE}
        </p>}
      </div>
      <div className={clsx(
        "col-span-0",
        "md:col-span-1",
      )}/>

    </footer>
  );
};

export default Footer;


export const ConfiguredFooter = () => (
  <Footer
    links={GLOBAL_LINKS} 
    socialLinks={SOCIAL_LINKS} 
    friendsLinks={FRIENDS_LINKS}
    />
)
import {
  BASE_URL,
  LICENSE_NOTICE,
  MAINTENANCE_NOTICE,
  OWNER,
  START_YEAR,
} from "../../config";
import React from "react";
import clsx from "clsx";
import { HeaderLogo } from '../HeaderLogo/HeaderLogo';

import { TbExternalLink } from 'react-icons/tb';
import type { Link, SocialLink } from '../types';
import { SocialButton } from '../SocialButton/SocialButton';
import { FRIENDS_LINKS, GLOBAL_LINKS, SOCIAL_LINKS } from '../../constants';
import type { ContactInfo } from '../../config';

export interface FooterProps {
  links?: Link[];
  friendsLinks?: Link[];
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo;
}

export const DEFAULT_LINKS: Link[] = [
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/services", label: "Services" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
];

export const DEFAULT_FRIENDS_LINKS: Link[] = [];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [];

const Footer = ({
  links = DEFAULT_LINKS,
  friendsLinks = DEFAULT_FRIENDS_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  contactInfo,
}: FooterProps) => {
  // Default contact info if not provided
  const contact = contactInfo ?? {
    physicalAddress: '',
    googleMapsUrl: '',
    mailingAddress: '',
    phoneNumber: '',
    email: '',
  };
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
      "pb-16",
    )}>

      <div className={clsx("col-span-0", "md:col-span-1")} />
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
      <div className={clsx("col-span-0", "md:col-span-4")} />
      <div className={clsx("col-span-0", "md:col-span-1")} />

      {/* Contact column */}
      <address className={clsx(
        "not-italic",
        "flex",
        "flex-col",
        "md:col-span-2",
        "md:items-start",
        "items-center",
        "justify-start",
        "text-center",
        "px-8",
      )}>
        <span className={clsx("type-caps", "px-6", "mb-2", "text-[var(--color-charcoal)]")}>
          Contact
        </span>
        {contact.physicalAddress && (
          <a
            className={clsx(
              "type-body-sm",
              "mt-2",
              "px-8",
              "max-w-md",
              "flex",
              "flex-row",
              "gap-2",
              "items-start",
              "text-left",
              "text-[var(--color-charcoal)]",
              "hover:text-[var(--color-terracotta)]",
              "transition-colors",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-2",
              "focus-visible:outline-[var(--color-forest)]",
              "rounded-sm",
            )}
            href={contact.googleMapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${contact.physicalAddress} on Google Maps`}
          >
            {contact.physicalAddress}
            <TbExternalLink aria-hidden="true" className="inline-block flex-shrink-0 mt-0.5" />
          </a>
        )}
        {contact.mailingAddress && (
          <div className={clsx(
            "type-body-sm",
            "mt-2",
            "px-8",
            "max-w-md",
            "flex",
            "flex-row",
            "items-start",
            "text-left",
            "text-[var(--color-charcoal)]",
          )}>
            Mailing: {contact.mailingAddress}
          </div>
        )}
        {contact.phoneNumber && (
          <div className={clsx(
            "type-body-sm",
            "mt-2",
            "px-8",
            "max-w-md",
            "flex",
            "flex-row",
            "items-start",
            "text-left",
            "text-[var(--color-charcoal)]",
          )}>
            Phone:{" "}
            <a
              href={`tel:${contact.phoneNumber}`}
              aria-label={`Call ${contact.phoneNumber}`}
              className="ml-1 hover:text-[var(--color-terracotta)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
            >
              {contact.phoneNumber}
            </a>
          </div>
        )}
        {contact.email && (
          <div className={clsx(
            "type-body-sm",
            "mt-2",
            "px-8",
            "max-w-md",
            "flex",
            "flex-row",
            "items-start",
            "text-left",
            "text-[var(--color-charcoal)]",
          )}>
            Email:{" "}
            <a
              href={`mailto:${contact.email}`}
              aria-label={`Email ${contact.email}`}
              className="ml-1 hover:text-[var(--color-terracotta)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
            >
              {contact.email}
            </a>
          </div>
        )}
      </address>

      {/* Navigation column */}
      <nav
        aria-label="Footer navigation"
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
        <span className={clsx("type-caps", "px-6", "mb-2", "text-[var(--color-charcoal)]")}>
          Navigation
        </span>
        {links.map((link) => (
          <a
            key={link.href}
            className={clsx(
              "type-body-sm",
              "px-8",
              "max-w-md",
              "text-[var(--color-charcoal)]",
              "hover:text-[var(--color-terracotta)]",
              "transition-colors",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-2",
              "focus-visible:outline-[var(--color-forest)]",
              "rounded-sm",
            )}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Friends & Other Links column */}
      {friendsLinks.length > 0 && (
        <nav
          aria-label="Friends and partner links"
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
          <span className={clsx("type-caps", "px-6", "mb-2", "text-[var(--color-charcoal)]")}>
            Friends &amp; Other Links
          </span>
          {friendLinkTopics.map((topic) => (
            <div key={topic} className="flex flex-col">
              <span className={clsx(
                "type-body-sm",
                "px-8",
                "max-w-md",
                "font-semibold",
                "text-[var(--color-charcoal)]",
              )}>
                {topic}
              </span>
              {friendsLinks
                .filter((link) => link.topic === topic)
                .map((link) => (
                  <a
                    key={link.href}
                    className={clsx(
                      "type-body-sm",
                      "px-8",
                      "max-w-md",
                      "text-[var(--color-charcoal)]",
                      "hover:text-[var(--color-terracotta)]",
                      "transition-colors",
                      "focus-visible:outline-2",
                      "focus-visible:outline-offset-2",
                      "focus-visible:outline-[var(--color-forest)]",
                      "rounded-sm",
                    )}
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                    {link.isExternal && (
                      <TbExternalLink aria-hidden="true" className="inline-block ml-1" />
                    )}
                  </a>
                ))}
            </div>
          ))}
        </nav>
      )}

      {/* Social + copyright column */}
      <div
        className={clsx(
          "flex",
          "flex-col",
          "font-light",
          "type-body-sm",
          "justify-start",
          "md:items-start",
          "items-center",
          "h-full",
          "px-6",
          "text-[var(--color-charcoal)]",
        )}
      >
        {socialLinks.length > 0 && (
          <>
            <span className={clsx("type-caps", "mb-2", "text-[var(--color-charcoal)]")}>
              Social
            </span>
            <nav aria-label="Social media links" className="flex space-x-1 px-2 mb-8 font-semibold text-base">
              {socialLinks.map((link) => (
                <SocialButton
                  key={link.href}
                  link={link.href}
                  brand={link.brand}
                />
              ))}
            </nav>
          </>
        )}

        <p className="m-0">
          <a
            href={BASE_URL + 'attribution'}
            className="underline hover:text-[var(--color-terracotta)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
          >
            Attribution Page
          </a>
        </p>
        <p className="mt-1 m-0">
          <a
            href="https://website-omega-five-37.vercel.app/keystatic"
            className="underline hover:text-[var(--color-terracotta)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
          >
            Admin Login
          </a>
        </p>
        <p className="mt-1 m-0">
          Copyright © {START_YEAR} - {new Date().getFullYear()}
        </p>
        <p className="m-0">
          {OWNER}.
        </p>
        {MAINTENANCE_NOTICE && (
          <p className="max-w-lg mx-auto mt-2 md:mt-6 mb-8">
            {MAINTENANCE_NOTICE}
          </p>
        )}
      </div>
      <div className={clsx("col-span-0", "md:col-span-1")} />
    </footer>
  );
};

export default Footer;


export const ConfiguredFooter = ({ contactInfo }: { contactInfo?: ContactInfo }) => (
  <Footer
    links={GLOBAL_LINKS}
    socialLinks={SOCIAL_LINKS}
    friendsLinks={FRIENDS_LINKS}
    contactInfo={contactInfo}
  />
)

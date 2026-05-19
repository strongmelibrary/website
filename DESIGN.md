# Strong, Me Public Library — Design Bible

> **This document is the single source of truth for all UI and design decisions.**
> Any agent or developer making a UI change MUST read this document in full before editing any component, page, or style file.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Inventory & Standards](#5-component-inventory--standards)
6. [Icon System](#6-icon-system)
7. [Button & Link Styles](#7-button--link-styles)
8. [Card & Tile Styles](#8-card--tile-styles)
9. [Navigation](#9-navigation)
10. [Accessibility Standards](#10-accessibility-standards)
11. [Page Standards](#11-page-standards)
12. [Design Compliance Reference](#12-design-compliance-reference)

---

## 1. Design Philosophy

Strong, Me Public Library is a small, beloved community institution founded in 1931 in Strong, Maine. Its website should feel like stepping into the library itself: warm wood tones, worn-paper textures, the smell of old books, pine trees outside the windows.

**Core principles:**

- **Heritage warmth** — The logo's color palette (forest green, terracotta, cream, charcoal) drives every design decision. No cold blues, no corporate greys, no neon accents.
- **Accessible first** — WCAG AA is the minimum. Every interactive element must have a visible focus ring, every image must have alt text, and semantic HTML is mandatory.
- **Mobile-first, progressively enhanced** — Design for small screens first, then layer in layout complexity for larger viewports.
- **No Astro default graphics** — All icons come from `react-icons`. Custom SVG illustrations (clock, flying books) from `/public/illustrations/` are acceptable since they are unique to this library.
- **Consistent icon library** — `react-icons` is the only approved icon source. Preferred sets: `react-icons/hi2` (Heroicons v2), `react-icons/tb` (Tabler), `react-icons/pi` (Phosphor), `react-icons/fa6` (Font Awesome 6 brands for social).
- **No raw emoji as UI elements** — Emoji (🏷️ 📅 📍 ☕) must not be used as UI icons; use `react-icons` equivalents wrapped with `aria-hidden` or `role="img"` with `aria-label`.
- **Warm, trustworthy, not corporate** — Rounded corners, gentle shadows, hand-lettered-feeling headings, and ample whitespace communicate community trust.

---

## 2. Color Palette

All colors are defined as CSS custom properties in [`src/styles/theme.css`](src/styles/theme.css) and referenced via Tailwind utility classes.

### 2.1 Primary Brand Colors

These are extracted from the library logo (`/public/brand/mark.svg` and `/public/brand/title.svg`).

| Name | Hex | CSS Variable | Tailwind Key | Usage |
|------|-----|--------------|--------------|-------|
| Forest Green | `#3D6B57` | `--color-forest` | `forest` | Primary brand emphasis, headings accent |
| Sage Green | `#88B2A0` | `--color-sage` | `sage` | Secondary accents, soft dividers |
| Terracotta | `#B25B36` | `--color-accent` | `accent` | CTAs, links, active states, accent marks |
| Terracotta Light | `#D4794F` | `--color-accent-light` | `accent-light` | Hover states |
| Terracotta Dark | `#8A4227` | `--color-accent-dark` | `accent-dark` | Active/pressed states |
| Charcoal | `#1E1E1E` | `--color-charcoal` | `charcoal` | Primary text, headings |
| Near-Black | `#1f292e` | `--color-base-neutral` | `base-neutral` | Body text |

### 2.2 Background Colors

| Name | Hex | CSS Variable | Tailwind Key | Usage |
|------|-----|--------------|--------------|-------|
| Cream / Off-white | `#FCEDC9` | `--color-paper` | `paper` | Page backgrounds, card interiors |
| Parchment Light | `#fff8f0` | `--color-paper-40` | `paper-40` | Used as `bg-paper` in Footer |
| Stone / Neutral | `#C4B49A` | `--color-stone` | `stone` | Borders, subtle dividers |

### 2.3 Semantic Colors

| Role | Dark | Light | Hex (Dark) | Notes |
|------|------|-------|-----------|-------|
| Info | `--color-info` / `--color-info-dark` | `--color-info-light` | `#495155` / `#dddedf` | Used for search bar bg; prefer forest green instead |
| Success | `--color-success` | `--color-success-light` | `#0e5c2d` / `#e7efea` | Availability badges |
| Warning | `--color-warning` | `--color-warning-light` | `#af640d` / `#f7efe7` | Warnings, caution badges |
| Error | `--color-error` | `--color-error-light` | `#a20d19` / `#f6e7e8` | Error states |

### 2.4 Neutral Scale

The existing `--color-neutral-0` through `--color-neutral-100` scale is acceptable but leans cool. Use sparingly; prefer warm brand tones.

### 2.5 Prohibited Colors

The following Tailwind default utilities are **not permitted** in this codebase. Use brand palette equivalents instead:

| Prohibited | Replace With |
|------------|-------------|
| `indigo-*` (any shade) | `forest` / `accent` palette |
| `blue-*` | `accent` color |
| `slate-*` for backgrounds | `paper` or `neutral` scale |
| `gray-*` for primary text | `charcoal` or `base-neutral` |
| `stone-50`, `stone-100`, `stone-200` | `paper` / `paper-10` variants |
| `amber-*`, `emerald-*`, `lime-*`, `yellow-*` (generic) | Approved only in the curated Calendar event pill palette |
| `green-*`, `red-*`, `yellow-*` for status | `success-*`, `error-*`, `warning-*` semantic tokens |

---

## 3. Typography

### 3.1 Font Stack

The active fonts (loaded via `postcss-google-font` in [`src/styles/theme.css`](src/styles/theme.css)) are:

| Role | Font | Weights | CSS Variable |
|------|------|---------|--------------|
| **Heading / Display** | Quicksand | 400, 700 | `--font-heading`, `--font-display` |
| **Body / UI** | Ledger | 400, 700 | `--font-body`, `--font-button` |
| **Monospace** | JetBrains Mono (via `@fontsource`) | Variable | `--font-mono` |

> **Consideration:** Quicksand is a clean rounded sans-serif — warm but not a traditional serif. For stronger heritage feel, consider migrating headings to **Lora** or **Playfair Display** from Google Fonts. This is a future enhancement; Quicksand stays for now.

### 3.2 Type Scale

Defined in [`src/styles/theme.css`](src/styles/theme.css) and utility classes in [`src/styles/utilities.css`](src/styles/utilities.css):

| Utility Class | Size | Line Height | Font Weight | Use Case |
|---------------|------|-------------|-------------|----------|
| `type-display-lg` | 108px | 136px | 300 | Hero display only |
| `type-display-md` | 72px | 90px | 300 | Large feature headers |
| `type-heading-xl` | 60px | 72px | 300 | Page-level h1 |
| `type-heading-lg` | 48px | 60px | 300/500 | Section h1/h2 |
| `type-heading-md` | 36px | 48px | 300/500 | h2/h3 |
| `type-heading-sm` | 24px | 36px | 300/500 | h3/h4 |
| `type-heading-xs` | 20px | 32px | 300/500 | h4/h5, card titles |
| `type-heading-xxs` | 16px | 28px | 300/500 | h5/h6, labels |
| `type-body-lg` | 20px | 30px | 400 | Lead paragraph |
| `type-body-md` | 16px | 24px | 400 | Default body text |
| `type-body-sm` | 14px | 22px | 400 | Secondary body, captions |
| `type-body-xs` | 12px | 20px | 400 | Meta info, timestamps |
| `type-body-xxs` | 10px | 18px | 400 | Legal fine print |
| `type-button` | 16px | 24px | 600 | Button labels |
| `type-button-sm` | 14px | 22px | 600 | Small button labels |
| `type-caps` | body | - | 400 | Small caps labels, categories |

### 3.3 Typography Standards

- **Headings:** Use `font-heading` (Quicksand) with appropriate `type-heading-*` class. Never use raw Tailwind `text-2xl font-bold` without the design-system utility.
- **Body:** Use `font-body` (Ledger) with appropriate `type-body-*` class.
- **Line length:** Keep prose content at max `65ch` for readability.
- **Prose blocks:** Use `@tailwindcss/typography` plugin with `prose` class. Override `prose-slate` with brand-appropriate color modifiers.
- **Letter spacing:** `type-caps` utility includes `letter-spacing: 0.1em` — do not add additional tracking to headings.
- **Minimum font size:** 14px (0.875rem) for any readable text. Never go below 12px.

---

## 4. Spacing & Layout

### 4.1 Base Spacing Unit

Tailwind's default 4px (0.25rem) base. Use the 4, 8, 12, 16, 24, 32, 48, 64px scale.

### 4.2 Container Widths

| Name | Value | Usage |
|------|-------|-------|
| Content narrow | `max-w-2xl` (672px) | Prose, single-column reading |
| Content default | `max-w-4xl` (896px) | Main page content grid |
| Content wide | `max-w-7xl` (1280px) | Full-width sections like Calendar |
| Header | `max-w-8xl` (1440px) | Navigation bar |

### 4.3 Page Padding

- **Mobile:** `px-4` (16px) side padding
- **Tablet+:** `px-8` (32px) side padding
- **Content blocks:** Vertically separate sections with `py-16` (64px) for major sections, `py-8` (32px) for subsections

### 4.4 Section Spacing

- **Top of page (below header):** `mt-0` — hero sections start flush
- **Between major page sections:** `gap-8` or `mt-16`
- **Between sidebar widgets:** `gap-4`
- **Footer top margin:** `mt-24` — keep

### 4.5 Responsive Breakpoints

| Breakpoint | px | Usage |
|------------|-----|-------|
| `sm` | 640px | Mobile → small tablet |
| `md` | 768px | Tablet — nav switches to horizontal |
| `lg` | 1024px | Desktop grid layouts |
| `xl` | 1280px | Wide content areas |

---

## 5. Component Inventory & Standards

### 5.1 BaseHead (`src/components/BaseHead.astro`)

**What it does:** Handles all `<head>` metadata including OG tags, favicon links, and imports `global.css`. Includes Google Fonts preconnect and stylesheet links for Quicksand and Ledger.

**Design standards followed:**
- Google Fonts preconnect links present (`fonts.googleapis.com`, `fonts.gstatic.com`)
- Quicksand (400/500/600/700) and Ledger loaded via Google Fonts `<link>` as fallback in addition to postcss-google-font
- OG image defaults to `annie-spratt-unsplash.jpg` — replace with branded image when available

**Mobile behavior:** N/A (head element).

---

### 5.2 Header (`src/components/Header/Header.tsx`)

**What it does:** Sticky top navigation bar using React `useState` for mobile toggle. Renders the logo, desktop nav links, and a hamburger button for mobile.

**Design standards followed:**
- Background: `bg-[var(--color-paper)]/95` with `backdrop-blur-sm`
- Border: `border-[var(--color-stone)]/30`
- Hamburger button icons: `HiBars3` (open) / `HiXMark` (close) from `react-icons/hi2`
- Hamburger button: `aria-expanded`, `aria-controls="mobile-menu"`, `aria-label` toggling "Open/Close navigation menu"
- Mobile menu: `id="mobile-menu"`, `bg-[var(--color-forest-dark)]`
- Both `<nav>` elements have `aria-label`
- Default links: News, Events, Services, Catalog, About
- `DEFAULT_SOCIAL_LINKS` is an empty array
- No dark mode variants

**Mobile behavior:** Vertical stacked links below the header bar when expanded. Hamburger button is `min-h-[44px]` via `w-10 h-10`.

---

### 5.3 HeaderLink (`src/components/HeaderLink/HeaderLink.tsx`)

**What it does:** Anchor tag styled as a navigation link with active-state bottom border indicator.

**Design standards followed:**
- Active: `border-[var(--color-terracotta)] opacity-100`
- Inactive: `border-transparent opacity-70`
- Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]`
- Font: `type-heading` with `font-bold` and `tracking-[0.05em]`
- No dark mode variants

**Mobile behavior:** Full-width touchable links, inherits layout from Header.

---

### 5.4 HeaderLogo (`src/components/HeaderLogo/HeaderLogo.tsx`)

**What it does:** Displays the library mark (`variant_mark.svg`) and word mark (`title.svg`) side by side as a linked logo lockup.

**Design standards followed:**
- Logo mark `alt="Strong, Me Public Library logo mark"`
- Word mark `alt={SITE_TITLE}` (dynamic from config)
- Wrapped in `<a href={BASE_URL}>` with appropriate `aria-label`
- No dark mode variants

**Mobile behavior:** Scales via fixed `h-[60px]`; flex row with `max-w-full` prevents overflow.

---

### 5.5 Footer (`src/components/Footer/Footer.tsx`)

**What it does:** 8-column grid footer with contact information, navigation links, and social buttons. Contact block uses semantic `<address>` element.

**Design standards followed:**
- Background: `bg-paper`, text: `text-[var(--color-charcoal)]`
- `DEFAULT_LINKS` set to library-appropriate pages
- `DEFAULT_FRIENDS_LINKS` and `DEFAULT_SOCIAL_LINKS` are empty arrays
- Contact block wrapped in `<address>` with `not-italic`
- Address link: `rel="noopener noreferrer"`, `aria-label`, and `TbExternalLink aria-hidden="true"`
- Phone/email links have `aria-label`
- Section labels use `type-caps`
- Link hover: `hover:text-[var(--color-terracotta)]`
- Friends links only rendered if `friendsLinks.length > 0`
- Social nav only rendered if `socialLinks.length > 0`
- No dark mode variants

**Mobile behavior:** Stacks to single column. Items center-align on mobile.

---

### 5.6 HeroIndex (`src/components/HeroIndex/HeroIndex.tsx`)

**What it does:** Full-width hero with a hero image, quick links section, and a terracotta gradient panel containing the catalog search bar, flying books illustration, and `TodaysHours` child component.

**Design standards followed:**
- Outer wrapper: `bg-[var(--color-paper)]`
- Search bar strip: `bg-[var(--color-forest)]`
- Hero `<img>` alt: `heroImageAlt` prop with sensible default
- Z-index: `z-10`/`z-20`
- Tagline: `drop-shadow-lg` for readability over images
- Search input: keyboard-accessible with `min-h-[44px]`, `focus-visible` ring
- Search button: `aria-label="Search catalog"`, `focus-visible:outline-white`
- Flying books illustration: `alt=""` `aria-hidden="true"` (decorative)

**Mobile behavior:** Image `h-[400px]` on mobile. Search/books panel stacks single-column.

---

### 5.7 Tile (`src/components/Tile/Tile.tsx`)

**What it does:** Post/news card component using the `.card .card-hover` utility classes.

**Design standards followed:**
- Container: `.card .card-hover p-4 md:p-6`
- Date: `type-body-xs text-[var(--color-charcoal)]/60`
- Title link: `type-heading-4 text-[var(--color-charcoal)] hover:text-[var(--color-terracotta)]` with focus ring
- Description: `type-body-sm text-[var(--color-charcoal)]/70`
- Tags: renders `<Tag>` components with proper gap

**Mobile behavior:** Full-width card, stacks vertically.

---

### 5.8 Tag (`src/components/Tag/Tag.tsx`)

**What it does:** Pill-style tag label using the `.tag` CSS utility class. Rendered inline as a `<span>`.

**Design standards followed:**
- Tag icon: `<HiTag aria-hidden="true" className="w-3 h-3" />` from `react-icons/hi2`
- Container: `<span>` (inline compatible)
- Applies `.tag` class (defined in `src/styles/utilities.css`) — parchment background, terracotta text, uppercase tracking

**Mobile behavior:** Inline, wraps naturally.

---

### 5.9 PostsList (`src/components/PostsList/PostsList.tsx`)

**What it does:** Renders a labeled `<section>` with an unordered list of `<Tile>` components.

**Design standards followed:**
- `aria-label="Posts"` on `<section>`
- Spacing: `space-y-6 mt-8`

**Mobile behavior:** Single-column list, stacks vertically.

---

### 5.10 PostDates (`src/components/PostDates/PostDates.tsx`)

**What it does:** Shows published and updated dates with icon+label pairs. Uses semantic `<time>` elements with `dateTime` attribute.

**Design standards followed:**
- Published date icon: `<HiCalendar aria-hidden="true" className="w-4 h-4 inline-block" />` from `react-icons/hi2`
- Updated date icon: `<HiArrowPath aria-hidden="true" className="w-4 h-4 inline-block" />` from `react-icons/hi2`
- Dates wrapped in `<time dateTime={...}>` elements
- Styled with `type-body-xs text-[var(--color-neutral-60)]`
- `flex-wrap` for narrow screens

**Mobile behavior:** Flex row with `flex-wrap` for small screens.

---

### 5.11 ReadMoreBlock (`src/components/ReadMoreBlock/ReadMoreBlock.tsx`)

**What it does:** Flexible content block used for featured article previews with an optional image, category label, title, subtitle, and "Read more" link.

**Design standards followed:**
- Category: `type-caps text-[var(--color-terracotta)]`
- Title: `text-[var(--color-charcoal)] hover:text-[var(--color-terracotta)]` with focus ring
- Subtitle: `type-body-sm text-[var(--color-charcoal)]/70`
- Separator bar: `bg-[var(--color-terracotta)]`
- HR: `border-[var(--color-stone)]/30`
- "Read more" link: `text-[var(--color-terracotta)]` with `HiArrowRight` icon (`aria-hidden="true"`) and full focus ring
- `pointer-events-none` on title when `separator=true` is intentional for section header usage

**Mobile behavior:** Image stacks above text on mobile.

---

### 5.12 LibraryHoursBlock (`src/components/LibraryHoursBlock/LibraryHoursBlock.tsx`)

**What it does:** Forest green card displaying the weekly hours schedule with a clock SVG watermark and terracotta accent bookmark. Wrapped in a `role="region"` for accessibility.

**Design standards followed:**
- Background: `bg-[var(--color-forest)]`
- Heading: `<h2>` (sidebar widget, not page heading)
- Row text: `text-[var(--color-paper)]`, muted rows: `text-[var(--color-paper)]/50`
- Bookmark triangle uses `border-[var(--color-terracotta)]`
- Clock illustration: `alt=""` `aria-hidden="true"` (decorative)
- Outer div: `role="region" aria-label="Library Hours"`

**Mobile behavior:** Full-width on mobile.

---

### 5.13 TodaysHours (`src/components/TodaysHours/TodaysHours.tsx`)

**What it does:** Live-updating hours display acting as the visual centrepiece of the terracotta gradient panel in `HeroIndex`. Shows the open/closed status, today's hours range, and a countdown to close/open time.

**Design standards followed:**
- Wrapper: `role="status" aria-live="polite"` — centered `flex flex-col gap-1 text-center`, no background
- Text: inherits `text-white` from the parent panel — passes WCAG AA on the terracotta gradient
- **Status word** (line 1): `type-heading-md font-heading drop-shadow-sm` — "Open", "Closed today", or "Opening later"
- **Hours range** (line 2): `type-heading-xxs font-heading drop-shadow-sm` — e.g. "9:00am – 5:00pm"
- **Countdown** (line 3): `type-body-sm opacity-80 drop-shadow-sm` — "Closes in 3 hours and 18 minutes" or "Opens tomorrow at 9:00am"
- Dev-only override indicator rendered only in `NODE_ENV === 'development'`

**Context:** Rendered as `children` of `HeroIndex` inside the `from-accent to-accent-light` gradient panel alongside the flying books illustration.

**Storybook:** Decorator wraps each story in the terracotta gradient panel to match production context.

**Mobile behavior:** `flex-col items-center` — centered stack, wraps with parent panel width.

---

### 5.14 Calendar (`src/components/Calendar/Calendar.tsx`)

**What it does:** Full-page calendar section displaying events in a monthly grid. Includes a modal for event detail, keyboard navigation, and focus trapping.

**Design standards followed:**
- Background: `bg-[var(--color-paper)]`
- Decorative blobs: `bg-[var(--color-parchment)]`, `bg-[var(--color-stone)]/20`
- Calendar header row: `bg-[var(--color-forest)] text-[var(--color-paper)]`
- Cell borders: `border-[var(--color-stone)]/30`
- Modal close button: `bg-[var(--color-forest)]` with `focus-visible:outline-[var(--color-paper)]`
- Event pills: `BRAND_PILL_CLASSES` (forest, terracotta, sage, warm brown, umber, med green, light terracotta)
- Location icon: `<HiMapPin aria-hidden="true" />` from `react-icons/hi2`
- `<section aria-label="Events Calendar">`
- Modal: `role="dialog" aria-modal="true" aria-labelledby`
- Focus auto-set to close button when modal opens
- Escape key closes modal
- Calendar cells with events have `role="button"` and keyboard `onKeyDown` handler
- Default events is an empty array — shows "No upcoming events" empty state

**Mobile behavior:** Panels stack full-width on mobile (`col-span-12`).

---

### 5.15 SocialButton (`src/components/SocialButton/SocialButton.tsx`)

**What it does:** Renders a circular icon-only anchor link (`<a>`) to a social media profile with a hover color shift to terracotta.

**Design standards followed:**
- Rendered as `<a href target="_blank" rel="noopener noreferrer">`
- `aria-label="Visit our {brand} page"`
- `border` (standard 1px)
- Background: `bg-[var(--color-paper)]`
- Icon color: `text-[var(--color-charcoal)]`
- Hover: `bg-[var(--color-terracotta)] border-[var(--color-terracotta)]` icon `text-white`
- Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]`
- Icon: `aria-hidden="true"`
- No dark mode variants

**Mobile behavior:** Fixed 40px circle, adequate touch target.

---

### 5.16 SearchWidget (`src/components/SearchWidget/SearchWidget.tsx`)

**What it does:** Catalog search form that queries the Bookworm API and displays results with availability status, pagination, and a "Request this book" CTA.

**Design standards followed:**
- Form: `role="search"`
- Input: `border-[var(--color-stone)]/50`, `focus-visible:ring-[var(--color-forest)]`, `bg-[var(--color-paper)]`
- Search button: `bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)]` with focus ring
- Loading spinner: `border-[var(--color-forest)]`
- Google Preview link: `text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)]`
- Availability "Available": `bg-[var(--color-success-light)] text-[var(--color-success-dark)]`
- Availability "not available": `bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]`
- Pagination buttons: `bg-[var(--color-paper)] border border-[var(--color-stone)]/30 hover:bg-[var(--color-stone)]/20`
- Result cards: `bg-[var(--color-paper)] border border-[var(--color-stone)]/20 rounded-lg`
- "Request this book" button: `aria-label` with current query
- CTA error state: brand terracotta colors
- No dark mode variants

**Mobile behavior:** Full-width form. Results stack as single-column cards.

---

## 6. Icon System

### 6.1 Approved Library

**Package:** `react-icons` (v5.5.0, already installed)

**Approved icon sets:**

| Set | Import | Use |
|-----|--------|-----|
| Heroicons v2 | `react-icons/hi2` | Primary UI icons (navigation, actions, status) |
| Tabler Icons | `react-icons/tb` | Social brand icons (`TbBrand*`), utility icons |
| Phosphor | `react-icons/pi` | Search (`PiMagnifyingGlassBold`), supplemental |
| Font Awesome 6 | `react-icons/fa6` | Social media brands if Tabler lacks them |

> **No other icon libraries are permitted.** Do not add `heroicons` package, `lucide-react`, or any other icon library.

### 6.2 Icon Sizing Standards

| Size Name | px | Tailwind | Use Case |
|-----------|-----|---------|----------|
| sm | 16px | `w-4 h-4` | Inline with text, tags |
| md | 20px | `w-5 h-5` | Button icons, nav |
| lg | 24px | `w-6 h-6` | Feature icons, social buttons |
| xl | 32px | `w-8 h-8` | Hero icons, empty states |

### 6.3 Icon Color

- Icons should **inherit text color** unless explicitly overridden
- Use `currentColor` (default in react-icons)
- Decorative icons must have `aria-hidden="true"`
- Meaningful icons must have `aria-label` or adjacent visible text

### 6.4 Current Icon Inventory

| Usage | Component | Icon |
|-------|-----------|------|
| Search button | HeroIndex, SearchWidget | `PiMagnifyingGlassBold` from `react-icons/pi` |
| External link | Footer, catalog.astro | `TbExternalLink` from `react-icons/tb` |
| Social brands | SocialButton | `TbBrand*` (dynamic) from `react-icons/tb` |
| Broken icon fallback | SocialButton | `PiImageBroken` from `react-icons/pi` |
| Tag marker | Tag | `HiTag` from `react-icons/hi2` |
| Published date | PostDates | `HiCalendar` from `react-icons/hi2` |
| Updated date | PostDates | `HiArrowPath` from `react-icons/hi2` |
| Location pin | Calendar, events.astro | `HiMapPin` from `react-icons/hi2` |
| Reading time | BlogPost.astro | `HiBookOpen` from `react-icons/hi2` |
| Arrow / "Read more" | ReadMoreBlock | `HiArrowRight` from `react-icons/hi2` |
| Hamburger open | Header | `HiBars3` from `react-icons/hi2` |
| Hamburger close | Header | `HiXMark` from `react-icons/hi2` |

When adding a new icon, add a row to this table.

### 6.5 Custom Illustrations

The following custom SVG illustrations in `/public/illustrations/` are approved library assets and are NOT considered "Astro default graphics":

- `clock.svg` — Used as watermark in LibraryHoursBlock
- `flying_books.svg` — Used in HeroIndex panel

---

## 7. Button & Link Styles

### 7.1 Primary Button

```
bg-accent text-paper font-button type-button
px-6 py-2.5 rounded-lg
hover:bg-accent-dark transition-colors duration-200
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
disabled:opacity-50 disabled:cursor-not-allowed
```

### 7.2 Secondary Button

```
bg-transparent text-accent font-button type-button
px-6 py-2.5 rounded-lg
border-2 border-accent
hover:bg-accent/10 transition-colors duration-200
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
```

### 7.3 Ghost / Text Button

```
bg-transparent text-accent font-button type-button
px-4 py-2 rounded
hover:bg-accent/10 transition-colors duration-200
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
```

### 7.4 Link Styles

- **Body links:** `text-accent hover:underline focus-visible:outline-accent focus-visible:outline-1 focus-visible:rounded-sm`
- **Nav links (header):** No underline, active state bottom border in `border-accent`
- **Footer links:** `text-neutral-80 hover:text-accent transition-colors`
- **External links:** Always include `TbExternalLink` icon (`aria-hidden="true"`) and `target="_blank" rel="noopener noreferrer"`

### 7.5 Focus Ring Standard

**All interactive elements** must have a visible focus indicator:

```
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
```

For elements on dark backgrounds:
```
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper
```

The `outline-style` should be `solid`. Do not use `focus:ring-*` without ensuring the ring color is brand-appropriate.

---

## 8. Card & Tile Styles

### 8.1 Standard Card

```
bg-paper border border-stone/30 rounded-lg shadow-sm
p-4 md:p-6
hover:shadow-md transition-shadow duration-200
```

### 8.2 Featured Card (e.g., events)

```
bg-paper border border-stone/40 rounded-xl shadow-md
p-6
```

### 8.3 Dark Card (e.g., hours block)

```
bg-forest text-paper border border-forest rounded-lg
p-5
```

### 8.4 Rounded Corners Standard

- Small elements (tags, badges): `rounded-full` or `rounded`
- Cards, panels: `rounded-lg`
- Featured/hero cards: `rounded-xl`
- Buttons: `rounded-lg`
- Input fields: `rounded` (subtle)

### 8.5 Shadow Standard

| Level | Class | Use |
|-------|-------|-----|
| Subtle | `shadow-sm` | Default cards |
| Standard | `shadow` | Slightly raised cards |
| Elevated | `shadow-md` | Modals, hover states |
| Heavy | `shadow-lg` | Drawers, overlays |

---

## 9. Navigation

### 9.1 Desktop Navigation

- Horizontal nav bar, right-aligned relative to logo
- Links use `HeaderLink` with `type-heading` + `font-bold` + `tracking-[0.05em]`
- Active link: bottom border `border-accent` in terracotta
- Social icon buttons to the right of nav links
- Header background: `bg-paper/95 backdrop-blur-sm` — warm cream
- Sticky top (`sticky top-0 z-50`)
- Max width: `max-w-8xl mx-auto`

### 9.2 Mobile Navigation

- Hamburger icon (`HiBars3`) toggles a vertical dropdown via React `useState`
- Toggle button uses `aria-expanded` (true/false) and `aria-controls="mobile-menu"`
- Icon swaps: `HiBars3` when closed, `HiXMark` when open
- Dropdown: `id="mobile-menu"`, `bg-[var(--color-forest-dark)] border-t border-stone/30`
- Links: full-width, `min-h-[44px]` for touch target
- Social buttons appear above nav links in mobile dropdown

### 9.3 Active Link Styling

- Determined via `isActive` prop on `HeaderLink`
- Active: `border-b-[2px] border-accent opacity-100`
- Inactive: `border-b-[2px] border-transparent opacity-70 hover:opacity-100`
- Note: active state must be passed from the page; `ConfiguredHeader` does not auto-detect current page

### 9.4 Logo Placement

- Logo (`HeaderLogo`) on the far left
- Mark (emblem) + word mark side by side
- Height: `60px` desktop, `48px` mobile (future enhancement)
- Wrapped in `<a href={BASE_URL}>` with appropriate aria-label

### 9.5 Footer Navigation

- Three-column desktop footer: Contact | Navigation | Friends
- Logo repeated at top of footer
- Social buttons in lower-left footer area

---

## 10. Accessibility Standards

### 10.1 Contrast Ratios (WCAG AA)

| Combination | Ratio Required | Check |
|-------------|---------------|-------|
| Body text on cream bg | 4.5:1 minimum | `#1E1E1E` on `#FCEDC9` ≈ 15:1 ✅ |
| Terracotta on cream | 4.5:1 minimum | `#B25B36` on `#FCEDC9` — verify ⚠️ |
| Cream text on forest green | 4.5:1 minimum | `#FCEDC9` on `#3D6B57` — verify ⚠️ |
| Accent links on white | 4.5:1 minimum | `#B25B36` on white ≈ 4.7:1 ✅ |

> Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify any new color combination before using it.

### 10.2 Focus Indicators

Every interactive element — links, buttons, inputs, checkboxes — must display a visible focus outline when navigated via keyboard:

```
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
```

Never use `outline-none` or `focus:outline-none` without providing an alternative visible focus style.

### 10.3 Semantic HTML Requirements

| Element | Use For |
|---------|---------|
| `<header>` | Site header |
| `<nav>` | Navigation lists — must have `aria-label` |
| `<main>` | Primary page content — one per page |
| `<article>` | Blog posts, news entries |
| `<aside>` | Sidebar widgets (hours, quick links) |
| `<footer>` | Site footer |
| `<section>` | Thematic groups within main — must have heading or `aria-label` |
| `<h1>` | One per page, page-level title only |
| `<h2>` | Major section headings |
| `<h3>–<h6>` | Subsection headings in hierarchy |
| `<time>` | Dates and times with `dateTime` attribute |
| `<address>` | Contact information |

### 10.4 Alt Text Standards

- **Informative images:** Descriptive alt text that conveys meaning
- **Decorative images:** `alt=""` (empty string, not omitted)
- **Logo mark:** `alt="Strong, Me Public Library logo mark"`
- **Word mark:** `alt={SITE_TITLE}` (dynamic from config)
- **Hero image:** `alt` should describe the scene (e.g., "The Strong, Me Public Library exterior in autumn")
- **Book jackets:** `alt={`Cover of ${title}`}`

### 10.5 Keyboard Navigation

- All interactive elements reachable via `Tab`
- Logical focus order that matches visual order
- Modal dialogs (Calendar event modal) must trap focus while open
- Hamburger menu: toggle is keyboard-operable with `Enter` and `Space`
- Skip navigation link present at the top of each page body: `<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-100 bg-paper px-4 py-2 rounded text-accent font-bold">Skip to main content</a>`

### 10.6 Screen Reader Considerations

- `aria-live="polite"` on `TodaysHours` for dynamic updates
- `aria-expanded` on mobile nav toggle
- `aria-hidden="true"` on decorative icons and illustrations
- `aria-label` on icon-only buttons (social buttons, search button)
- `role="search"` on SearchWidget form

---

## 11. Page Standards

This section documents the current design structure and standards for each page. All pages share a common layout: skip navigation link → sticky `<Header>` → `<main id="main-content">` → `<Footer>`.

### 11.1 `src/pages/index.astro` — Home

**Layout:** Full-width hero (`HeroIndex`) followed by a two-column grid (news list + sidebar) inside `max-w-4xl lg:mx-auto`.

**Design standards:**
- `<body>` uses `bg-paper` (warm cream background)
- `<main id="main-content">` with skip navigation target
- News section heading: `<h2 class="type-heading-sm">Latest News</h2>`
- Sidebar contains `LibraryHoursBlock` and `ReadMoreBlock` (services highlight)
- No inline `<script>` tags querying DOM by CSS class

---

### 11.2 `src/pages/about.astro` — About

**Layout:** Full-width CSS background image hero, then `prose` content block inside `max-w-2xl`.

**Design standards:**
- `<body>` uses `bg-paper`
- `<main id="main-content">`
- Hero background div has `role="img" aria-label="..."` if meaningful
- Body content uses `prose` with brand color overrides (not `prose-slate`)
- Vertical spacing uses margin utilities, not empty `<div>` spacers

---

### 11.3 `src/pages/services.astro` — Services

**Layout:** Identical structure to `about.astro` — full-width hero + `prose` content block.

**Design standards:** Same as `about.astro`. Uses brand-colored prose.

---

### 11.4 `src/pages/news.astro` — News

**Layout:** Page heading + `PostsList` of news articles.

**Design standards:**
- `<body>` uses `bg-paper`
- `<main id="main-content">`
- `<h1 class="type-heading-md">News</h1>` — no CSS `!important` modifier; prose overrides resolved via modifier classes

---

### 11.5 `src/pages/events.astro` — Events

**Layout:** Full-width `Calendar` component followed by a static event list section.

**Design standards:**
- `<body>` uses `bg-paper flex flex-col min-h-screen`
- `<main id="main-content">`
- Event date text: `text-accent` (terracotta)
- "Cancelled" badge: `bg-error-light text-error-dark`
- Event tags: `bg-paper border border-stone/40 text-neutral-80`
- Location icon: `<HiMapPin aria-hidden="true" />` from `react-icons/hi2`
- Article borders: `border-stone/30`
- Event cards: `.card` utility class (brand card style)

---

### 11.6 `src/pages/catalog.astro` — Catalog

**Layout:** Page heading + `SearchWidget`.

**Design standards:**
- `<body>` uses `bg-paper flex flex-col min-h-screen`
- `<main id="main-content">`
- `<h1 class="type-heading-md">Catalog</h1>` — no CSS `!important` modifier
- External link icon `TbExternalLink` has `aria-hidden="true"`

---

### 11.7 `src/pages/tags.astro` — Tags

**Layout:** Page heading + tag cloud list.

**Design standards:**
- `<body>` uses `bg-paper`
- `<main id="main-content">`
- `<h1 class="type-heading-md">Tags</h1>` — no CSS `!important` modifier
- `<ConfiguredFooter>` receives `contactInfo` prop

---

### 11.8 `src/pages/attribution.astro` — Attribution

**Layout:** Page heading + attribution content (photo credits, library information).

**Design standards:**
- `<body>` uses `bg-paper`
- `<main id="main-content">`
- Page contains attribution content for all photography and third-party assets used on the site
- `<ConfiguredFooter>` receives `contactInfo` prop

---

### 11.9 `src/layouts/BlogPost.astro` — Blog/News Post Layout

**Layout:** Full-width hero image with attribution overlay, then `prose` article body, then tag list.

**Design standards:**
- `<body>` uses `bg-paper`
- `<main id="main-content">`
- Reading time icon: `<HiBookOpen aria-hidden="true" />` from `react-icons/hi2`
- Body content uses `prose` with brand color overrides (not `prose-slate`)
- Tag links use `${BASE_URL}/tags/${tag}` with correct `BASE_URL` prefix

---

## 12. Design Compliance Reference

This section is a quick-reference checklist for anyone making changes to the codebase. It summarizes the non-negotiable standards every UI contribution must satisfy.

### Before Making Any UI Change

- [ ] Read `DESIGN.md` in full (this document)
- [ ] Confirm the proposed change is consistent with the documented design standards
- [ ] If the change is not covered, update `DESIGN.md` first

### Color

- [ ] All colors come from the brand palette (Section 2)
- [ ] No prohibited Tailwind default color utilities (Section 2.5)
- [ ] New color combinations verified at WCAG AA contrast (Section 10.1)
- [ ] CSS custom properties used (`var(--color-*)`) or Tailwind brand tokens

### Typography

- [ ] Headings use `type-heading-*` utility class (Section 3.2)
- [ ] Body text uses `type-body-*` utility class
- [ ] No raw Tailwind typography utilities (`text-2xl font-bold`) without design-system class pairing
- [ ] Prose blocks use `prose` with brand color overrides, not `prose-slate`

### Icons

- [ ] Only `react-icons` used — no other icon packages (Section 6.1)
- [ ] Icon selected from an approved set (hi2, tb, pi, fa6)
- [ ] Icon sized correctly for context (Section 6.2)
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Functional icons have `aria-label` or adjacent visible text
- [ ] New icon added to inventory table (Section 6.4)

### Accessibility

- [ ] All interactive elements have visible focus ring (Section 10.2)
- [ ] Semantic HTML elements used correctly (Section 10.3)
- [ ] `<h1>` appears exactly once per page
- [ ] Images have appropriate alt text (Section 10.4)
- [ ] `<main id="main-content">` present for skip navigation
- [ ] Skip navigation link at top of page (Section 10.5)
- [ ] Dynamic content uses `aria-live` regions
- [ ] Interactive elements meet minimum 44px touch target on mobile

### New Components

- [ ] Read Section 5 (Component Inventory) before writing code
- [ ] After implementing, add an entry to Section 5 with: what it does, design standards, mobile behavior
- [ ] Dark mode variants are **not** used in this project

### Dark Mode

- [ ] **No dark mode** — do not add `dark:` variant classes to any element. The site uses a warm cream light theme exclusively.

---

*Design Bible — Strong, Me Public Library. Last updated: 2026-05-19.*

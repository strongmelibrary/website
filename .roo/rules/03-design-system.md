# Rule 03: Design System Compliance

## DESIGN.md is the Source of Truth

[`DESIGN.md`](../../DESIGN.md) at the project root is the **single source of truth** for all UI and design decisions for the Strong, Me Public Library website.

---

## Mandatory Pre-Edit Requirement

**Before making ANY UI change**, an agent or developer MUST:

1. **Read [`DESIGN.md`](../../DESIGN.md) in full** — every section, including the color palette, typography standards, component inventory, icon system, accessibility requirements, and implementation checklist.
2. Confirm that the proposed change is consistent with the documented design standards.
3. If the proposed change is NOT covered by `DESIGN.md`, update `DESIGN.md` first (adding or modifying the relevant section), then implement the change.

This rule applies to ALL modifications, including but not limited to:
- Adding or editing any `.tsx`, `.astro`, `.css`, or style-related file
- Adding new components or layouts
- Modifying color values, spacing, typography, or shadows
- Adding new pages

---

## New Component Requirement

When creating a **new component**, you MUST:

1. Read `DESIGN.md` Section 5 (Component Inventory & Standards) before writing any code.
2. After implementing the component, **add a new entry to Section 5** of `DESIGN.md` documenting:
   - What the component does
   - The design standards it follows
   - Its mobile behavior
   - Any props that affect visual appearance

Failing to document a new component in `DESIGN.md` is a violation of this rule.

---

## Icon System Rule

**Only `react-icons` is the approved icon library.** No other icon package may be added or used.

When adding an icon to any component:

1. Read `DESIGN.md` Section 6 (Icon System) first.
2. Select an icon ONLY from the approved sets listed in Section 6.1:
   - `react-icons/hi2` — Heroicons v2 (primary choice)
   - `react-icons/tb` — Tabler Icons (social brands and utility)
   - `react-icons/pi` — Phosphor Icons (supplemental)
   - `react-icons/fa6` — Font Awesome 6 (social media brands)
3. Apply the correct sizing standard from Section 6.2 (`w-4 h-4` sm, `w-5 h-5` md, `w-6 h-6` lg, `w-8 h-8` xl).
4. Add `aria-hidden="true"` to decorative icons.
5. Add `aria-label` or adjacent visible text to functional icons.
6. **Replace any emoji used as UI elements** with the appropriate `react-icons` equivalent from the replacement table in Section 6.4.
7. After adding a new icon, update the icon inventory table in `DESIGN.md` Section 6.4.

**Do NOT use:**
- Inline SVGs (except for the approved custom illustrations in `/public/illustrations/`)
- Any icon from `heroicons` npm package, `lucide-react`, `@radix-ui/react-icons`, or any other icon library
- Emoji characters as UI icons (🏷️ 📅 📍 ☕ 🔃 etc.)

---

## Color Usage Rule

When applying color to any element, you MUST:

1. Read `DESIGN.md` Section 2 (Color Palette) before choosing any color.
2. Use **only** colors defined in the brand palette documented in `DESIGN.md`:
   - Primary: forest green (`#3D6B57`), terracotta (`#B25B36`), charcoal (`#1E1E1E`)
   - Background: cream/paper (`#fff8f0`), parchment (`#FCEDC9`)
   - Accents: sage (`#88B2A0`), stone (`#C4B49A`)
   - Semantic: success, warning, error, info (see Section 2.3)
3. Reference colors via CSS custom properties (`var(--color-accent)`) or their Tailwind equivalents (`bg-accent`, `text-accent`, etc.).
4. **Do NOT use** raw Tailwind default color utilities that are not in the brand palette, including but not limited to:
   - `indigo-*`, `blue-*`, `violet-*`, `purple-*` (off-brand cool hues)
   - `slate-*` for backgrounds (use `paper` or `neutral` instead)
   - `gray-*` for primary text (use `charcoal` or `base-neutral`)
   - `stone-50`, `stone-100`, `stone-200` for backgrounds (use `paper`)
   - `amber-*`, `emerald-*`, `lime-*`, `yellow-*` for generic use (approved only in the curated Calendar event pill palette)
   - `green-*`, `red-*`, `yellow-*` for status badges (use the semantic `success-*`, `error-*`, `warning-*` tokens)
5. Always verify new color combinations meet WCAG AA contrast ratio (4.5:1 for text) as documented in Section 10.1.

---

## Accessibility Rule

Every UI change must comply with the accessibility standards in `DESIGN.md` Section 10:

- All interactive elements must have a visible focus indicator using the standard focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`)
- Never use `outline-none` or `focus:outline-none` without a replacement visible focus style
- Semantic HTML elements must be used as documented in Section 10.3
- `<h1>` must appear exactly once per page and represent the page's primary title
- All images must have descriptive alt text; decorative images use `alt=""`
- Dynamic content updates must use `aria-live` regions

---

## Typography Rule

When applying typography styles, use **only** the design system utility classes defined in `DESIGN.md` Section 3 and [`src/styles/utilities.css`](../../src/styles/utilities.css):

- `type-heading-*` for headings (uses Quicksand font)
- `type-body-*` for body text (uses Ledger font)
- `type-button` / `type-button-sm` for buttons
- `type-caps` for small-caps labels

**Do NOT** use raw Tailwind typography utilities like `text-2xl font-bold` without pairing them with the design system utility classes. Raw size classes are only acceptable inside `prose` blocks managed by `@tailwindcss/typography`.

---

## Enforcement Summary

| Action | Required Before Proceeding |
|--------|---------------------------|
| Any UI edit | Read `DESIGN.md` in full |
| Add new component | Read Section 5, then add entry after implementing |
| Add any icon | Read Section 6, pick from approved sets only |
| Use any color | Read Section 2, pick from brand palette only |
| Add a button or link | Read Section 7 for style standards |
| Add a card or tile | Read Section 8 for card standards |
| Change navigation | Read Section 9 |
| Any change to a page | Read Section 11 for known audit findings first |
| Mark a checklist item done | Update Section 12 implementation checklist |

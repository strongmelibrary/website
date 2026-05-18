# Keystatic CMS Setup

This project uses [Keystatic](https://keystatic.com/) as a headless CMS for managing content. The CMS is designed for a **dual-deploy** pattern: the public website remains fully static (deployed via FTP), while a separate CMS admin panel is deployed to a platform like Netlify.

## Architecture

```
Librarian → cms.example.com/keystatic (Netlify/Vercel)
         → Logs in with GitHub
         → Edits content (news, services, library hours, etc.)
         → Keystatic commits to main branch on GitHub
         → GitHub Actions triggers
         → Static build (no Keystatic)
         → FTP deploy to public site
```

### Key Principle

The `KEYSTATIC_CMS` environment variable controls the build mode:
- **Not set / `false`**: Static build — the existing FTP deploy workflow. Keystatic integration is excluded entirely.
- **`true`**: Hybrid build — includes Keystatic admin UI at `/keystatic` and API routes for content management.

## Local Development

### Running with CMS

```bash
npm run dev:cms
```

This starts the Astro dev server in hybrid mode with Keystatic's local file-based storage. Visit `http://localhost:4321/keystatic` to access the admin panel.

### Running without CMS (standard dev)

```bash
npm run dev:astro
```

This is the standard development mode, identical to the production static build.

## Content Structure

Content is managed in `src/content/` with the following structure:

### Collections

| Collection | Path | Description |
|-----------|------|-------------|
| **News** | `src/content/news/*/` | News posts and announcements |
| **Services** | `src/content/services/*/` | Library service descriptions |
| **Pages** | `src/content/pages/*/` | Static pages (e.g., About) |

Each collection entry is a directory containing an `index.mdoc` (Markdoc) file with YAML frontmatter.

### Singletons

| Singleton | Path | Description |
|-----------|------|-------------|
| **Site Info** | `src/content/site-info/index.json` | Site title, description, owner |
| **Contact Info** | `src/content/contact-info/index.json` | Address, phone, email |
| **Library Hours** | `src/content/library-hours/index.json` | Weekly schedule |

## Deploying the CMS Admin Panel

### Netlify (Recommended)

1. Create a new site in Netlify pointing at the `strongmelibrary/website` repo
2. Configure build settings:
   - **Build command**: `npm run build:cms`
   - **Publish directory**: `dist/`
3. Set environment variables:
   - `KEYSTATIC_CMS=true`
   - `KEYSTATIC_GITHUB_CLIENT_ID` — from GitHub OAuth App
   - `KEYSTATIC_GITHUB_CLIENT_SECRET` — from GitHub OAuth App
   - `KEYSTATIC_SECRET` — a random secret string
   - Plus all `PUBLIC_*` variables from the production config

### Setting up GitHub Authentication

1. Run `npm run dev:cms` locally
2. Visit `http://localhost:4321/keystatic`
3. Follow the prompts to create a GitHub OAuth App
4. Copy the Client ID and Secret into your deployment environment variables
5. Generate a random `KEYSTATIC_SECRET` (e.g., `openssl rand -hex 32`)

## What the Librarian Needs

- A **GitHub account** (free)
- The **URL** to the deployed CMS admin panel
- That's it — no terminal, git, or code knowledge required

## Configuration

The Keystatic content schema is defined in [`keystatic.config.ts`](keystatic.config.ts). The Astro content collection schemas are defined in [`src/content/config.ts`](src/content/config.ts). These two files must be kept in sync when adding new content types.

## Environment Variables

| Variable | Required For | Description |
|----------|-------------|-------------|
| `KEYSTATIC_CMS` | CMS deploy | Set to `true` to enable CMS mode |
| `KEYSTATIC_GITHUB_CLIENT_ID` | CMS deploy | GitHub OAuth App Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | CMS deploy | GitHub OAuth App Client Secret |
| `KEYSTATIC_SECRET` | CMS deploy | Random secret for session signing |

Note: The existing `PUBLIC_*` environment variables continue to work as before. Some content (site info, contact info, library hours) can now also be managed via Keystatic, but the env vars serve as fallback defaults.
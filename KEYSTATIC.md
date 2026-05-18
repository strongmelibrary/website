# Keystatic CMS Setup

This project uses [Keystatic](https://keystatic.com/) as a headless CMS for managing content. The CMS is designed for a **dual-deploy** pattern: the public website remains fully static (deployed via FTP), while a separate CMS admin panel is deployed to a platform like Vercel.

## Architecture

```
Librarian → cms.example.com/keystatic (Vercel)
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

### Vercel (Recommended)

1. Create a new project in Vercel pointing at the `strongmelibrary/website` repo
2. Configure build settings:
   - **Framework Preset**: Astro
   - **Build command**: `npm run build:cms`
   - **Output directory**: `dist/`
3. Set environment variables in the Vercel dashboard:
   - `KEYSTATIC_CMS=true`
   - `KEYSTATIC_GITHUB_CLIENT_ID` — from GitHub OAuth App
   - `KEYSTATIC_GITHUB_CLIENT_SECRET` — from GitHub OAuth App
   - `KEYSTATIC_SECRET` — a random secret string
   - Plus all `PUBLIC_*` variables from the production config

> **⚠️ `PUBLIC_KEYSTATIC_STORAGE=github` — no manual Vercel setup needed**
> This variable is codified in [`vercel.json`](vercel.json) and is automatically injected at build time.
> Do **not** set it to `local` (or omit it) or Keystatic will silently fall back to local file storage,
> even when all GitHub OAuth credentials are present. Because [`keystatic.config.ts`](keystatic.config.ts)
> uses `import.meta.env` (resolved at **build time** by Vite/Astro), this variable **must** be present
> during the Vercel build — not just at runtime.

### Setting up GitHub Authentication

1. Run `npm run dev:cms` locally
2. Visit `http://localhost:4321/keystatic`
3. Follow the prompts to create a GitHub OAuth App
   - Set the **Authorization callback URL** to: `https://your-site.vercel.app/api/keystatic/github/oauth/callback`
4. Copy the Client ID and Secret into your Vercel environment variables
5. Generate a random `KEYSTATIC_SECRET` (e.g., `openssl rand -hex 32`)

## What the Librarian Needs

- A **GitHub account** (free)
- The **URL** to the deployed CMS admin panel
- That's it — no terminal, git, or code knowledge required

## Troubleshooting

### OAuth Callback Returns 401 (GitHub returns 200)

**Symptom**: GitHub successfully exchanges the OAuth code for an access token (`POST github.com/login/oauth/access_token → 200`), but Keystatic's own callback handler returns 401 (`GET /api/keystatic/github/oauth/callback → 401`).

**Root Cause**: `KEYSTATIC_SECRET` is `undefined` inside the Vercel serverless function that handles the callback. Keystatic uses this secret to verify the signed OAuth state cookie it set when the login flow began. If the secret is absent, the HMAC signature check fails and Keystatic returns 401 as a security measure.

This happens for one of two reasons:

#### Reason A — Environment scope mismatch (most common)

Vercel env vars are scoped per environment: **Production**, **Preview**, **Development**. If `KEYSTATIC_SECRET`, `KEYSTATIC_GITHUB_CLIENT_ID`, and `KEYSTATIC_GITHUB_CLIENT_SECRET` were set in the dashboard for **Production** but you're accessing a **Preview** deployment (or vice versa), the serverless function sees `undefined`.

**Fix**: In the Vercel dashboard → **Settings → Environment Variables**, confirm all three secrets are enabled for the correct environment(s):
- ☑ Production
- ☑ Preview (if you test via Preview URLs)

#### Reason B — Stale deployment (env vars added after last deploy)

Vercel env vars only take effect on the **next deployment** triggered after they are saved. If the secrets were added to the dashboard after the last deploy, the running serverless functions still don't have them.

**Fix**: Trigger a fresh Vercel re-deploy (e.g., push a trivial commit or use **Deployments → Redeploy** in the dashboard).

#### Reason C — `import.meta.env` bake-time issue

Vite replaces `import.meta.env.*` references **at build time**. If any part of the Keystatic integration reads secrets via `import.meta.env.KEYSTATIC_SECRET` (rather than `process.env`), the variable must be present during the Vercel **Build Step**, not just at runtime.

**Fix**: In the Vercel dashboard for each of the three secrets, check **"Also expose to Build Step"** (or "Available during build"). Then re-deploy.

> **Note**: Never put secret values (`KEYSTATIC_SECRET`, `KEYSTATIC_GITHUB_CLIENT_SECRET`) in [`vercel.json`](vercel.json) — that file is committed to the repository. Secrets belong in the Vercel dashboard only.

#### Checklist for 401 debugging

1. [ ] Open Vercel dashboard → **Settings → Environment Variables**
2. [ ] Confirm `KEYSTATIC_SECRET` is present with a non-empty value (not just whitespace)
3. [ ] Confirm `KEYSTATIC_GITHUB_CLIENT_ID` matches the GitHub OAuth App exactly
4. [ ] Confirm `KEYSTATIC_GITHUB_CLIENT_SECRET` matches the GitHub OAuth App exactly
5. [ ] Confirm all three are enabled for the environment matching your deployment URL (Production/Preview)
6. [ ] Trigger a fresh **Redeploy** in the Vercel dashboard after confirming the above
7. [ ] Confirm the GitHub OAuth App **Authorization callback URL** exactly matches `https://your-vercel-domain/api/keystatic/github/oauth/callback`

---

## Configuration

The Keystatic content schema is defined in [`keystatic.config.ts`](keystatic.config.ts). The Astro content collection schemas are defined in [`src/content/config.ts`](src/content/config.ts). These two files must be kept in sync when adding new content types.

## Environment Variables

| Variable | Required For | Description |
|----------|-------------|-------------|
| `KEYSTATIC_CMS` | CMS deploy | Set to `true` to enable CMS mode (server-side: adapter & integrations) |
| `PUBLIC_KEYSTATIC_STORAGE` | CMS deploy | Set to `github` to enable GitHub storage (client-side: admin UI). Defaults to `local` |
| `KEYSTATIC_GITHUB_CLIENT_ID` | CMS deploy | GitHub OAuth App Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | CMS deploy | GitHub OAuth App Client Secret |
| `KEYSTATIC_SECRET` | CMS deploy | Random secret for session signing |

Note: The existing `PUBLIC_*` environment variables continue to work as before. Some content (site info, contact info, library hours) can now also be managed via Keystatic, but the env vars serve as fallback defaults.
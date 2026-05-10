# Waqar Moid Portfolio

A full-stack personal portfolio website for Md Waqar Moid — a living CV, creative archive, social hub, and personal blog. Literary and intellectually serious in tone, with a dark amber-and-steel aesthetic.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/portfolio run dev` — run the frontend (port 21113)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, TanStack Query, Tailwind CSS v4
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (blog_posts, projects tables)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- External: Goodreads RSS, Letterboxd RSS, Spotify API

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/blog.ts` — blog_posts table
- `lib/db/src/schema/projects.ts` — projects table
- `artifacts/api-server/src/routes/` — Express route handlers (blog, projects, auth, goodreads, letterboxd, spotify)
- `artifacts/portfolio/src/pages/` — React pages (home, cv, projects, blog, connect)
- `artifacts/portfolio/src/index.css` — design system, CSS variables, fonts

## Architecture decisions

- Blog and projects data live in Replit's built-in PostgreSQL via Drizzle ORM
- Goodreads, Letterboxd, and Spotify data are fetched live from their respective APIs/RSS feeds on each request (no caching in DB)
- Admin auth is a simple password check against ADMIN_PASSWORD env var, with a token stored in sessionStorage — no full auth library
- File uploads for projects are handled by storing a Supabase Storage URL directly; the frontend sends the URL to the API, which stores it in the DB
- All API contracts defined in OpenAPI first, then codegen produces typed React Query hooks and Zod validators

## Product

- **Home** (`/`): Hero landing with name, bio, and 4 portal cards to each section
- **CV** (`/cv`): Full academic CV rendered as styled HTML with PDF download
- **Projects** (`/projects`): Gallery of uploaded documents/presentations with category filtering, search, and password protection
- **Thoughts** (`/blog`): Editorial blog with rich text editor (admin only) and reading progress bar on posts
- **Connect** (`/connect`): Social links grid + live Goodreads, Letterboxd, and Spotify widgets

## User preferences

- Dark theme only — color palette strictly as defined in the design system
- Fonts: Economica (headings), Gill Sans (body), Playfair Display (pull-quotes), JetBrains Mono (code)
- No emojis anywhere in the UI
- No Bootstrap, Material UI, or pre-built component libraries beyond shadcn/ui

## Gotchas

- After any OpenAPI spec change, always run `pnpm --filter @workspace/api-spec run codegen` then `pnpm run typecheck:libs` before touching route handlers
- The Goodreads RSS feed requires the shelf to be set to public in Goodreads privacy settings
- Spotify widget requires a valid refresh token; the token is used to auto-refresh access tokens
- Admin session is stored in sessionStorage only — it expires when the browser tab closes
- To upload a CV PDF, place it at `artifacts/portfolio/public/cv.pdf`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- API hooks are imported from `@workspace/api-client-react`
- Zod validators are imported from `@workspace/api-zod`

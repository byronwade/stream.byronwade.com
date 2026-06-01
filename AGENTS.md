<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Stream — Agent Guide

**Stream** (`stream.byronwade.com`) is a **frontend-only** streaming platform concept. It demonstrates discovery, watch, clips, chat, moderation, and creator studio flows with **mocked backend behavior**. Brand name is **Stream** — never **Relay**.

This is a portfolio/demo project. Keep that framing honest: simulated auth, chat, analytics, and ingest — not production infrastructure.

## Hard constraints

| Constraint | Detail |
|------------|--------|
| Static export | `output: 'export'` in `next.config.ts` — build emits `out/` |
| No server runtime | No API routes, Route Handlers, Server Actions, middleware, or server-only data fetching |
| No backend | No database, ORM, real auth provider, WebSocket ingest, WebRTC, RTMP, or external APIs |
| Client mutations | Session, follows, clips, reports, watch prefs, layout — all via `localStorage` |
| Build-time data | Seed content lives in `src/data/*.json`, read at build time through `src/lib/data/index.ts` |

Server Components may read JSON seed data for static pages. Anything that **mutates** user state must be a Client Component using stores or URL state.

## What NOT to build

Do **not** add unless the user explicitly requests a full architecture change:

- `src/app/api/**` routes or Route Handlers
- Server Actions (`"use server"`)
- Real authentication (OAuth, JWT, cookies, Supabase Auth, Clerk, etc.)
- Databases, Prisma, Supabase tables, Redis, or sync across devices
- Live chat backends, WebSocket servers, or message persistence beyond localStorage
- Video ingest, transcoding, HLS origin servers, or WebRTC signaling
- Analytics pipelines (Segment, Mixpanel server-side, etc.)
- Environment-variable secrets for backend services

If a feature needs persistence, extend the existing **localStorage store pattern** (`src/lib/stores/base.ts`) or URL params — do not introduce a server.

## Mock data architecture

### 1. JSON seed (build time)

```
src/data/
  streams.json      # Live/scheduled streams, discovery metadata
  creators.json     # Channels, stats, avatars
  categories.json   # Browse categories
  clips.json        # Seed clips
  chat-seed.json    # Personas + tag templates for chat simulator
  analytics.json    # Studio analytics snapshots
```

Access via typed helpers in `src/lib/data/index.ts` (`getStreamBySlug`, `filterStreams`, `searchAll`, etc.). Types in `src/lib/types/index.ts`.

### 2. localStorage mutations (runtime)

Stores use `createStore` + `useSyncExternalStore`. Keys are prefixed `stream:v1:`:

| Key | Store file | Purpose |
|-----|------------|---------|
| `stream:v1:session` | `session.ts` | Mock auth (demo PIN `1234`) |
| `stream:v1:follows` | `follow.ts` | Follow/unfollow creators |
| `stream:v1:clips` | `clip.ts` | User-created clips |
| `stream:v1:reports` | `report.ts` | Content reports (Studio moderation) |
| `stream:v1:watch` | `watch.ts` | Watch preferences |
| `stream:v1:layout` | `layout.ts` | Layout preferences |
| `stream:v1:banner-dismissed` | `concept-banner.tsx` | Disclaimer banner |

Cross-tab sync: session, follows, and reports stores listen for `storage` events and call `hydrate()`.

`ui.ts` holds ephemeral UI state (search overlay, toasts) — not persisted.

### 3. Static route generation

Dynamic routes **must** export `generateStaticParams()` using slug/handle/id helpers from `src/lib/data/index.ts`:

- `src/app/live/[streamSlug]/page.tsx`
- `src/app/channels/[handle]/page.tsx`
- `src/app/categories/[slug]/page.tsx`
- `src/app/clips/[clipId]/page.tsx`

New dynamic segments require the same pattern or the static export build will fail.

### 4. Runtime simulators

`src/lib/mock/simulators.ts` provides client hooks:

- `useViewerPulse` — fluctuating viewer counts
- `useChatSimulator` — messages from seeded personas
- `useAnalyticsSimulator` / `useHealthSimulator` — studio retention and health metrics

These run only in the browser; never wire them to real services.

## Architecture map

```
src/
  app/                    # App Router pages (static at build)
    page.tsx              # Homepage
    discover/             # Mood/size/sort filters
    live/[streamSlug]/    # Watch page (+ watch-client.tsx)
    channels/[handle]/    # Creator channel
    categories/[slug]/    # Category browse
    clips/                # Clip grid, detail, user clips (/clips/view)
    auth/                 # Mock login/signup/PIN flows
    following/            # Followed creators
    library/clips/        # Saved clips
    studio/               # Creator dashboard (analytics, moderation, go-live)
    search/, schedule/    # Search and schedule
    globals.css           # Tailwind v4 @theme tokens + component classes
    layout.tsx            # Root layout, fonts, providers

  components/
    shell/                # AppShell, pill-nav, search, toasts, concept banner
    bloom/                # BloomLayer shared-element panels
    stream/               # Player, cards, mood rail, clip composer
    chat/                 # Chat panel, catch-me-up
    creator/              # Identity card, go-live wizard
    studio/               # Dashboard, moderation, analytics cards
    providers.tsx         # Client providers wrapper

  lib/
    data/index.ts         # JSON accessors (build-time)
    stores/               # localStorage stores
    mock/simulators.ts    # Chat, viewers, analytics mocks
    types/index.ts        # Shared TypeScript types
    utils/                # cn, format, catch-up helpers

  data/*.json             # Seed content

public/media/             # Demo video, posters, avatars, optional HLS mock
```

**Patterns:**

- Pages that need interactivity split into `*-client.tsx` Client Components.
- Watch page Bloom panels are **URL-driven**: `?panel=catch-up|clip|report|creator|filter|analytics`.
- Media assets: replace files under `public/media/`; per-stream paths in `streams.json`.

## Design conventions

### Tailwind v4 tokens

Semantic tokens live in `src/app/globals.css` under `@theme` — colors (`bg-canvas`, `accent-primary`, `live`), radii (`panel`, `card`), shadows, easings. Use token classes (`bg-bg-elevated`, `text-text-secondary`) instead of raw hex in components.

### Glass vs solid surfaces

- **Glass/translucent** — chrome only: nav header, chat sidebar, Bloom panels (`.glass-card`, `.chat-card`, `.bloom-panel`).
- **Solid** — forms, analytics cards, studio dashboards, auth screens.

Do not apply backdrop-blur or overlay backgrounds to content-heavy panels.

### Bloom panels

`BloomLayer` (`src/components/bloom/bloom-layer.tsx`) uses Motion `layoutId` for shared-element transitions. Open/close state syncs to the `panel` search param on the watch page so URLs are shareable.

### Motion

Respect `prefers-reduced-motion` — BloomLayer already gates animations via `useReducedMotion`.

### Storybook

Optional component docs under `*.stories.tsx`. Run `npm run storybook` — not required for feature work.

## Testing

```bash
npm test              # Vitest unit tests (src/lib/__tests__/)
npm run test:watch    # Vitest watch mode
npm run test:e2e      # Builds static export, serves out/ on port 3456, runs Playwright
npm run lint          # ESLint
```

E2E config (`playwright.config.ts`): `baseURL` is `http://127.0.0.1:3456`, served via `npx serve out -l 3456` after build. Tests live in `tests/e2e/`.

Always run `npm run build` before claiming static-export compatibility — dynamic routes without `generateStaticParams` will fail the build.

## Deployment

- **Build output:** `npm run build` → `out/`
- **Node:** 22.x (see `package.json` engines)
- **Vercel:** Framework preset **Next.js**, build command `npm run build`. **Do not** manually set the output directory to `out` in project settings — the Next.js builder handles static export internally; overriding breaks the deploy.
- **Other hosts:** Upload `out/` after build.

## Quick reference for common tasks

| Task | Where to change |
|------|-----------------|
| Add a stream/creator/category | Edit `src/data/*.json`, ensure slugs in `generateStaticParams` |
| Add mock user behavior | Extend store in `src/lib/stores/` with new `stream:v1:*` key |
| Add watch-page panel | Bloom panel in watch-client + `panel` URL param handling |
| Change visual theme | `src/app/globals.css` `@theme` block |
| Swap demo video/thumbnails | `public/media/` |
| Simulate live metrics | `src/lib/mock/simulators.ts` hooks in client components |

When in doubt: **frontend polish and honest mocks** over **real infrastructure**.

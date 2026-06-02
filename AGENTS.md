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
  streams.json      # Live/scheduled streams, discovery metadata, VOD chapters
  creators.json     # Channels, stats, avatars
  categories.json   # Browse categories
  clips.json        # Seed clips
  chat-seed.json    # Personas + tag templates for chat simulator
  analytics.json    # Studio analytics snapshots
  emotes.json       # Global + channel/tier emote sets
  predictions.json  # Seed prediction markets per stream
  rewards.json      # Channel-point redemption catalog
  whispers.json     # Seeded DM/whisper threads
  notifications.json# Seed notification feed items
```

Access via typed helpers in `src/lib/data/index.ts` (`getStreamBySlug`, `filterStreams`, `searchAll`, etc.). Types in `src/lib/types/index.ts`.

### 2. localStorage mutations (runtime)

Stores use `createStore` + `useSyncExternalStore`. Keys are prefixed `stream:v1:`:

| Key | Store file | Purpose |
|-----|------------|---------|
| `stream:v1:session` | `session.ts` | Mock auth (demo PIN `1234`), studio PIN unlock |
| `stream:v1:follows` | `follow.ts` | Follow/unfollow creators, streams, categories |
| `stream:v1:clips` | `clip.ts` | User-created clips |
| `stream:v1:reports` | `report.ts` | Content reports + blocked terms + chat controls (Studio moderation) |
| `stream:v1:watch` | `watch.ts` | Watch preferences |
| `stream:v1:layout` | `layout.ts` | Layout preferences |
| `stream:v1:reminders` | `reminder.ts` | Scheduled-stream / schedule reminders |
| `stream:v1:polls` | `poll.ts` | Local poll votes |
| `stream:v1:settings` | `settings.ts` | Studio settings + scene notes |
| `stream:v1:clip-edits` | `clip-edits.ts` | Studio clip title / featured overrides |
| `stream:v1:banner-dismissed` | `concept-banner.tsx` | Disclaimer banner |
| `stream:v1:theme` | `theme.ts` | Light / dark / system theme mode |
| `stream:v1:prefs` | `prefs.ts` | Viewer notification + playback prefs (autoplay-next, mini-player-on-leave, reduced-data) |
| `stream:v1:subscriptions` | `subscription.ts` | Mock channel subscriptions + tier |
| `stream:v1:points` | `points.ts` | Per-channel mock channel-point balances |
| `stream:v1:predictions` | `prediction.ts` | Viewer bets on prediction markets |
| `stream:v1:whispers` | `whisper.ts` | DM threads (seed + locally appended) |
| `stream:v1:notifications` | `notification.ts` | Notification feed + read state |
| `stream:v1:history` | `history.ts` | Watch history → "Continue watching" rail |
| `stream:v1:onboarded` | `onboarding.ts` | First-visit tour completion flag |
| `stream:v1:alerts` | `alerts.ts` | Studio alert-box + follower-goal config |
| `stream:v1:restream` | `restream.ts` | Studio restream destination toggles + fake keys |

Cross-tab sync: session, follows, and reports stores listen for `storage` events and call `hydrate()`.

`ui.ts` holds ephemeral UI state (search overlay, toasts, global shortcuts overlay) — not persisted.

**Hydration:** client-only UI that reads a localStorage store (theme toggle, notification bell, onboarding tour, continue-watching rail) gates first paint with `useHydrated()` (`src/lib/hooks/use-hydrated.ts`) — a `useSyncExternalStore` shim that returns `false` during SSR/hydration. Do **not** use `useEffect(() => setMounted(true))` (trips the `react-hooks/set-state-in-effect` lint rule).

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
- `usePointsAccrual` — accrues mock channel points while "watching"
- `useNotificationSimulator` — periodically pushes feed items (went-live, new clip, reply)

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
    studio/               # Creator dashboard (analytics, moderation, go-live,
                          #   monetization, alerts, restream)
    search/, schedule/    # Search and schedule
    settings/             # Unified settings (appearance/account/playback/a11y)
    messages/             # Whisper / DM inbox
    squad/                # Multistream grid (2–4 streams, one active audio)
    about/, help/         # Marketing/about + FAQ accordion
    manifest.ts           # PWA manifest (force-static → /manifest.webmanifest)
    sitemap.ts, robots.ts # SEO (force-static)
    loading.tsx           # Route-level skeletons (home/discover/watch/studio)
    error.tsx,            # Segment error boundary
    global-error.tsx      # Root error boundary
    globals.css           # Tailwind v4 @theme tokens (dark + light) + components
    layout.tsx            # Root layout, fonts, providers, no-flash theme script

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
    hooks/use-hydrated.ts # SSR-safe hydration gate
    mock/simulators.ts    # Chat, viewers, analytics, points, notification mocks
    types/index.ts        # Shared TypeScript types
    utils/                # cn, format, catch-up helpers

  components/seo/json-ld.tsx  # <script type="application/ld+json"> helper
  components/stream/mini-player.tsx  # Persistent PiP player + context

  data/*.json             # Seed content

public/media/             # Demo video, posters, avatars, optional HLS mock
public/og/                # Precomputed per-stream / per-channel OG SVGs
scripts/generate-og.mjs   # Regenerates public/og/*.svg from seed JSON
```

**Patterns:**

- Pages that need interactivity split into `*-client.tsx` Client Components.
- Watch page Bloom panels are **URL-driven**: `?panel=catch-up|clip|report|creator|filter|analytics|subscribe|predict|rewards`.
- Media assets: replace files under `public/media/`; per-stream paths in `streams.json`.
- Global overlays mounted once in `AppShell`: search, toasts, keyboard-shortcuts (`?`), mini-player, onboarding tour, notification bell.

## Design conventions

### Tailwind v4 tokens

Semantic tokens live in `src/app/globals.css` under `@theme` — colors (`bg-canvas`, `accent-primary`, `live`), radii (`panel`, `card`), shadows, easings. Use token classes (`bg-bg-elevated`, `text-text-secondary`) instead of raw hex in components.

### Glass vs solid surfaces

- **Glass/translucent** — chrome only: nav header, chat sidebar, Bloom panels (`.glass-card`, `.chat-card`, `.bloom-panel`).
- **Solid** — forms, analytics cards, studio dashboards, auth screens.

Do not apply backdrop-blur or overlay backgrounds to content-heavy panels.

### Theme system (light / dark / system)

- Tokens are defined twice in `globals.css`: dark is the default `@theme`/`:root`; light overrides live under `:root[data-theme="light"]`. Both also set `color-scheme`.
- `ThemeProvider` (`src/components/shell/theme-provider.tsx`) reads the `theme` store and sets `data-theme` on `<html>`; for `system` it follows `prefers-color-scheme` and reacts to OS changes.
- A tiny inline **no-flash script** in `layout.tsx` applies the stored theme before paint (so there's no FOUC). `<html>` uses `suppressHydrationWarning`.
- Expose switching via `ThemeToggle` (account menu, footer, `/settings#appearance`). Never hardcode hex — add a token to both palettes.

### Accessibility modes

- `watch.ts` persists `audioOnly` (hides video, shows an `audio-viz` placeholder) and `captionStyle` (size/background). The player (`cinematic-player.tsx`) maps these to `.cap-*` classes that style `::cue`.
- Configure from `/settings#accessibility`.

### Bloom panels

`BloomLayer` (`src/components/bloom/bloom-layer.tsx`) uses Motion `layoutId` for shared-element transitions. Open/close state syncs to the `panel` search param on the watch page so URLs are shareable.

### Motion

Respect `prefers-reduced-motion` — BloomLayer already gates animations via `useReducedMotion`.

### Storybook

Optional component docs under `*.stories.tsx`. Run `npm run storybook` — not required for feature work.

## SEO / PWA (static-export safe)

- **OG images:** dynamic `next/og` `ImageResponse` is **not** used (incompatible with `output: 'export'`). Instead `scripts/generate-og.mjs` precomputes branded `public/og/<slug>.svg` and `public/og/channel-<handle>.svg` from seed JSON. Run `npm run og:generate` after editing stream/creator seeds. Watch/channel `generateMetadata` references these.
- **JSON-LD:** watch pages emit `VideoObject` (+ `BroadcastEvent` when live), channel pages emit `ProfilePage`/`Person`, via `components/seo/json-ld.tsx` rendered in the **server** page.
- **Manifest/theme-color:** `app/manifest.ts` (`dynamic = "force-static"`) + `viewport.themeColor` in `layout.tsx`.
- **loading/error:** route `loading.tsx` skeletons reuse `components/ui/skeleton.tsx`; `error.tsx` + `global-error.tsx` are on-brand client boundaries.

## Testing

```bash
npm test                  # Vitest unit tests (src/lib/__tests__/)
npm run test:watch        # Vitest watch mode
npm run test:e2e          # Build + serve out/ on :3456 + Playwright (chromium project: flows + axe a11y)
npm run test:visual       # Visual-regression project only (toHaveScreenshot)
npm run test:visual:update# Regenerate screenshot baselines (platform-specific)
npm run lint              # ESLint
```

E2E config (`playwright.config.ts`): `baseURL` is `http://127.0.0.1:3456`, served via `npx serve out -l 3456` after build. Tests live in `tests/e2e/` — `stream.spec.ts`/`flows.spec.ts` (functional), `a11y.spec.ts` (`@axe-core/playwright`, fails on serious/critical), `visual.spec.ts` (separate `visual` project; videos/canvas masked). Visual baselines are per-OS, so CI runs the visual job as **non-blocking** until Linux baselines are committed.

Always run `npm run build` before claiming static-export compatibility — dynamic routes without `generateStaticParams` will fail the build.

## Deployment

- **Build output:** `npm run build` → `out/`
- **Node:** 22.x (see `package.json` engines)
- **Vercel:** Framework preset **Next.js**, build command `npm run build`. **Do not** manually set the output directory to `out` in project settings — the Next.js builder handles static export internally; overriding breaks the deploy.
- **Other hosts:** Upload `out/` after build.

## Quick reference for common tasks

| Task | Where to change |
|------|-----------------|
| Add a stream/creator/category | Edit `src/data/*.json`, ensure slugs in `generateStaticParams`, run `npm run og:generate` |
| Add mock user behavior | Extend store in `src/lib/stores/` with new `stream:v1:*` key |
| Add watch-page panel | Bloom panel in watch-client + `panel` URL param handling |
| Change visual theme / add token | `src/app/globals.css` — add to **both** dark `@theme` and `[data-theme="light"]` |
| Add a studio page | Route under `src/app/studio/*` + entry in `STUDIO_NAV` (`studio/layout.tsx`); stays behind PIN gate |
| Swap demo video/thumbnails | `public/media/` |
| Simulate live metrics | `src/lib/mock/simulators.ts` hooks in client components |
| Client-only UI reading a store | Gate first paint with `useHydrated()` (not a setState effect) |

When in doubt: **frontend polish and honest mocks** over **real infrastructure**.

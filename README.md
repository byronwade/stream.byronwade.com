# Stream

**Stream** is a frontend-only streaming platform concept with mocked backend flows. It demonstrates product parity with major live platforms — discovery, watch, clips, chat, moderation, and creator studio — without real ingest, auth, or analytics infrastructure.

> This is a portfolio demonstration project, not a functioning live broadcast stack.

## Thesis

A live platform designed around **discovery fit**, **context**, and **community health** instead of raw popularity. Key differentiators include Catch Me Up, Join Late, mood-based discovery, and structured chat tabs.

## Tech stack

- **Next.js 16** App Router with `output: 'export'` (static export)
- **Tailwind CSS v4** with semantic design tokens
- **Motion** for Bloom shared-element panel transitions
- **localStorage** stores via `useSyncExternalStore` for session, follows, clips, reports, and layout prefs
- Static JSON seed data at build time

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build static export

```bash
npm run build
```

Output is written to `out/` and can be deployed to Vercel or any static host.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Static export build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run storybook` | Component Storybook |

## Route map

| Route | Description |
|-------|-------------|
| `/` | Homepage — featured hero, mood rail, live grid |
| `/discover` | Discovery with mood/size/sort filters |
| `/live/[slug]` | Watch page — player, chat, Bloom panels |
| `/channels/[handle]` | Creator channel |
| `/categories/[slug]` | Category browse |
| `/clips`, `/clips/[id]` | Clip grid and detail |
| `/clips/view?id=` | User-created clips (localStorage) |
| `/search`, `/schedule` | Search and schedule |
| `/auth/*` | Mock auth flows |
| `/following`, `/library/clips` | User library |
| `/studio/*` | Creator dashboard |

Bloom panels on the watch page use shareable URL params: `?panel=catch-up|clip|report|creator`.

## Mock behaviors

- **Auth**: localStorage session, demo PIN `1234`
- **Follow/unfollow**: optimistic UI with persistence
- **Chat**: simulated messages from seeded personas
- **Viewer counts**: pulsing mock timers
- **Clips**: trim and publish to local clip store (keyboard `C` on watch page)
- **Reports**: stored locally, visible in Studio moderation queue
- **Go Live**: wizard transitions to simulated stream manager

## Swapping media assets

Replace files under `public/media/` without code changes:

```
public/media/
  demo-loop.mp4          # Main demo video (reused across streams)
  placeholder-poster.svg # Stream posters
  placeholder-thumb.svg  # Thumbnails
  creators/              # Avatar and banner SVGs
  categories/            # Category hero images
  demo/manifest.m3u8     # Optional HLS quality selector mock
  demo/captions.vtt      # Mock captions track
```

Per-stream assets can be added at `public/media/streams/{slug}/` and referenced in `src/data/streams.json`.

## Design system

Tokens are defined in `src/app/globals.css` under `@theme`. Component classes include `.glass-card`, `.pill-nav`, `.bloom-panel`, `.video-stage`, and `.chat-card`.

Translucency is used only for chrome (nav, chat, panels); forms and analytics use solid surfaces.

## Deploy

This project uses Next.js `output: 'export'` — the build writes static files to `out/`.

**Vercel:** Link the repo with Framework preset **Next.js**, Node **22.x**, build command `npm run build`. Leave the output directory unset in project settings (do not manually set `out` — that breaks the Next.js builder).

**Any static host:** Upload `out/` after `npm run build`.

Linked Vercel project: `wades-web-dev/stream.byronwade.com`.

## License

MIT — demonstration project.

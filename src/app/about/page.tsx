import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Stream is a frontend-only streaming platform concept — a portfolio demo with mocked auth, chat, clips, and creator studio flows.",
};

const FEATURES = [
  { title: "Mood-based discovery", body: "Browse live streams by vibe and community size, with a boost for smaller, healthier communities.", href: "/discover" },
  { title: "Catch Me Up", body: "Join a stream late and get an instant recap with jump-to-moment timestamps.", href: "/live/forest-city-build?panel=catch-up" },
  { title: "Engagement layer", body: "Mock subscriptions, channel points, predictions, emotes, and whispers — all client-side.", href: "/live/forest-city-build" },
  { title: "Squad multistream", body: "Watch up to four live streams at once with a single active audio source.", href: "/squad" },
  { title: "Creator Studio", body: "Analytics, moderation, monetization, alerts, and restream targets behind a demo PIN.", href: "/studio" },
  { title: "Clips & VOD", body: "Compose clips from the player and seek replays by chapter.", href: "/clips" },
];

const STACK = ["Next.js (static export)", "React 19", "TypeScript", "Tailwind CSS v4", "Motion", "localStorage stores"];

export default function AboutPage() {
  return (
    <div className="section-shell py-10">
      <section className="mx-auto max-w-3xl text-center">
        <span className="live-badge mx-auto">Portfolio demo</span>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          A streaming platform concept, built entirely on the frontend.
        </h1>
        <p className="mt-4 text-text-secondary">
          <span className="font-semibold text-text-primary">Stream</span> demonstrates discovery,
          watch, clips, chat, moderation, and creator studio flows. There is no backend — auth,
          chat, analytics, subscriptions, and ingest are all honestly simulated in your browser.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/discover" className="btn-primary">
            Explore streams
          </Link>
          <Link href="/studio" className="btn-secondary">
            Open the studio
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-5 text-center text-lg font-semibold">What&apos;s inside</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="solid-surface transition-colors hover:border-accent-primary/30 focus-ring"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{f.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="solid-surface">
          <h2 className="font-semibold">Honest framing</h2>
          <p className="mt-2 text-sm text-text-secondary">
            This is a demonstration project, not production infrastructure. There is no database,
            real authentication, WebSocket chat, RTMP ingest, or video transcoding. Everything you
            change — follows, clips, subscriptions, points, settings — is stored in{" "}
            <code className="font-mono text-xs">localStorage</code> under the{" "}
            <code className="font-mono text-xs">stream:v1:*</code> namespace and never leaves your
            device.
          </p>
        </div>
        <div className="solid-surface">
          <h2 className="font-semibold">Built with</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {STACK.map((s) => (
              <li key={s} className="pill-nav text-xs">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-secondary">
            Have questions? Visit the{" "}
            <Link href="/help" className="text-accent-primary hover:underline focus-ring">
              help center
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

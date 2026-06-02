import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help",
  description: "Frequently asked questions about the Stream concept demo.",
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is this a real streaming platform?",
    a: "No. Stream is a frontend-only portfolio demo. Live video is a looping sample clip, chat is simulated, and there is no backend, database, or real authentication.",
  },
  {
    q: "How do I sign in? Is there a password?",
    a: (
      <>
        Any email and password are accepted on the{" "}
        <Link href="/auth/login" className="text-accent-primary hover:underline">
          sign-in page
        </Link>{" "}
        — it creates a mock local session. The Creator Studio uses a demo PIN of{" "}
        <strong>1234</strong>.
      </>
    ),
  },
  {
    q: "Where is my data stored?",
    a: "Entirely in your browser's localStorage under the stream:v1:* namespace. Nothing is sent to a server. Clearing your browser storage resets everything.",
  },
  {
    q: "How do channel points and predictions work?",
    a: "You accrue mock channel points automatically while watching a live stream. You can spend them on redemptions or stake them on predictions. Prediction outcomes are resolved with a simulated random result.",
  },
  {
    q: "What do subscriptions unlock?",
    a: "Subscribing (a mock action, no payment) grants a subscriber badge in chat and unlocks that channel's tier emotes in the emote picker. Higher tiers unlock more emotes.",
  },
  {
    q: "Can I change the theme?",
    a: (
      <>
        Yes — pick Light, Dark, or System from the account menu, the footer, or{" "}
        <Link href="/settings#appearance" className="text-accent-primary hover:underline">
          Settings → Appearance
        </Link>
        . System follows your OS preference.
      </>
    ),
  },
  {
    q: "Is there an accessibility / audio-only mode?",
    a: (
      <>
        Yes. In{" "}
        <Link href="/settings#accessibility" className="text-accent-primary hover:underline">
          Settings → Accessibility
        </Link>{" "}
        you can enable audio-only playback and customize caption size and background. Motion is
        reduced automatically when your system prefers reduced motion.
      </>
    ),
  },
  {
    q: "What keyboard shortcuts are available?",
    a: "Press ? anywhere to open the shortcuts cheat sheet. Press / to open search. On the watch page, Space toggles playback and C opens the clip composer.",
  },
  {
    q: "How do clips and replays work?",
    a: "On any live or recorded stream, open the Clip composer to mock-publish a clip to your library. Ended streams show seekable chapters so you can jump around the replay.",
  },
];

export default function HelpPage() {
  return (
    <div className="section-shell py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Help center</h1>
        <p className="mt-2 text-text-secondary">
          Answers about how this demo works. Still curious? Read the{" "}
          <Link href="/about" className="text-accent-primary hover:underline focus-ring">
            about page
          </Link>
          .
        </p>

        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-card border border-border-subtle bg-bg-elevated px-4 open:bg-bg-elevated-2"
            >
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-medium">
                {f.q}
                <span
                  className="shrink-0 text-text-tertiary transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="pb-4 text-sm text-text-secondary">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-10 solid-surface text-center">
          <p className="text-sm text-text-secondary">Want the quick tour again?</p>
          <p className="mt-1 text-xs text-text-tertiary">
            Re-run the welcome tour from{" "}
            <Link href="/settings#appearance" className="text-accent-primary hover:underline focus-ring">
              Settings → Appearance
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

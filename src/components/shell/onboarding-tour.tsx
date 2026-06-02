"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useOnboarding } from "@/lib/stores/onboarding";
import { useHydrated } from "@/lib/hooks/use-hydrated";

const STEPS = [
  {
    title: "Welcome to Stream",
    body: "A frontend-only streaming platform concept. Auth, chat, channel points, subs, and analytics are all mocked client-side — no backend, no real data.",
    emoji: "👋",
  },
  {
    title: "Discover by mood",
    body: "Browse live streams by vibe and community size. Smaller, healthier communities get a discovery boost.",
    emoji: "◎",
  },
  {
    title: "Watch & engage",
    body: "Use Catch Me Up to get a recap, create clips, earn channel points, subscribe for emotes, and join predictions.",
    emoji: "▶",
  },
  {
    title: "Creator Studio",
    body: "Peek at analytics, moderation, monetization, alerts, and restream targets. The demo studio PIN is 1234.",
    emoji: "▣",
  },
];

export function OnboardingTour() {
  const { done, complete } = useOnboarding();
  const pathname = usePathname();
  const mounted = useHydrated();
  const [step, setStep] = useState(0);

  if (!mounted || done) return null;
  if (pathname.startsWith("/auth/")) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome tour"
    >
      <div className="solid-surface w-full max-w-md">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-2xl" aria-hidden>
            {current.emoji}
          </span>
          <span className="text-xs text-text-tertiary">
            {step + 1} / {STEPS.length}
          </span>
        </div>
        <h2 className="text-lg font-bold">{current.title}</h2>
        <p className="mt-2 text-sm text-text-secondary">{current.body}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={complete} className="text-xs text-text-tertiary hover:text-text-secondary focus-ring">
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-secondary text-sm">
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? complete() : setStep((s) => s + 1))}
              className="btn-primary text-sm"
            >
              {isLast ? "Got it" : "Next"}
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-accent-primary" : "w-1.5 bg-border-strong"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

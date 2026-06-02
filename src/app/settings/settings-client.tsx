"use client";

import Link from "next/link";
import type { CaptionBackground, CaptionSize } from "@/lib/types";
import { useSession } from "@/lib/stores/session";
import { useWatchPrefs } from "@/lib/stores/watch";
import { useViewerPrefs } from "@/lib/stores/prefs";
import { useOnboarding } from "@/lib/stores/onboarding";
import { useUIStore } from "@/lib/stores/ui";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils/cn";

const SECTIONS = [
  { id: "appearance", label: "Appearance" },
  { id: "account", label: "Account" },
  { id: "playback", label: "Playback" },
  { id: "notifications", label: "Notifications" },
  { id: "accessibility", label: "Accessibility" },
];

const QUALITIES = ["auto", "1080", "720", "480"];
const CAPTION_SIZES: CaptionSize[] = ["sm", "md", "lg", "xl"];
const CAPTION_BACKGROUNDS: CaptionBackground[] = ["solid", "semi", "none"];

const CAPTION_FONT_PX: Record<CaptionSize, number> = { sm: 14, md: 17, lg: 22, xl: 28 };

export function SettingsClient() {
  const { user, isAuthenticated, updateUser } = useSession();
  const {
    quality,
    captionsEnabled,
    theaterMode,
    audioOnly,
    captionStyle,
    setQuality,
    setCaptions,
    setTheaterMode,
    setAudioOnly,
    setCaptionStyle,
  } = useWatchPrefs();
  const { notify, autoplayNext, reducedData, miniPlayerOnLeave, setNotify, setPref } = useViewerPrefs();
  const { restart } = useOnboarding();
  const { addToast } = useUIStore();

  const captionBg =
    captionStyle.background === "solid"
      ? "rgba(0,0,0,0.92)"
      : captionStyle.background === "semi"
        ? "rgba(0,0,0,0.5)"
        : "transparent";

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-text-secondary">
        Preferences are stored locally in your browser — this is a frontend-only demo.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav className="hidden lg:block" aria-label="Settings sections">
          <ul className="sticky top-24 space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="focus-ring block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-elevated-2 hover:text-text-primary"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          <section id="appearance" className="solid-surface scroll-mt-24">
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-text-secondary">Choose light, dark, or follow your system.</p>
            <div className="mt-4">
              <ThemeToggle />
            </div>
            <div className="mt-5 border-t border-border-subtle pt-4">
              <button
                type="button"
                onClick={() => {
                  restart();
                  addToast("Welcome tour will show on your next page load.");
                }}
                className="btn-secondary text-sm"
              >
                Replay welcome tour
              </button>
            </div>
          </section>

          <section id="account" className="solid-surface scroll-mt-24">
            <h2 className="text-lg font-semibold">Account</h2>
            {isAuthenticated && user ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Display name</span>
                  <input
                    className="input-field"
                    value={user.displayName}
                    onChange={(e) => updateUser({ displayName: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Handle</span>
                  <input
                    className="input-field"
                    value={user.handle}
                    onChange={(e) => updateUser({ handle: e.target.value.replace(/\s/g, "") })}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium">Email</span>
                  <input
                    type="email"
                    className="input-field"
                    value={user.email}
                    onChange={(e) => updateUser({ email: e.target.value })}
                  />
                </label>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border-subtle bg-bg-elevated-2 p-4">
                <p className="text-sm text-text-secondary">Sign in to edit your mock profile.</p>
                <Link href="/auth/login" className="btn-primary text-sm">
                  Sign in
                </Link>
              </div>
            )}
          </section>

          <section id="playback" className="solid-surface scroll-mt-24">
            <h2 className="text-lg font-semibold">Playback defaults</h2>
            <div className="mt-4">
              <span className="mb-2 block text-sm font-medium">Default quality</span>
              <div className="flex flex-wrap gap-2">
                {QUALITIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    aria-pressed={quality === q}
                    className={cn(quality === q ? "pill-nav-active" : "pill-nav focus-ring")}
                  >
                    {q === "auto" ? "Auto" : `${q}p`}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 divide-y divide-border-subtle">
              <Toggle label="Captions on by default" checked={captionsEnabled} onChange={setCaptions} />
              <Toggle label="Theater mode by default" checked={theaterMode} onChange={setTheaterMode} />
              <Toggle
                label="Autoplay next recommended stream"
                description="Mock — surfaces a suggested stream when one ends."
                checked={autoplayNext}
                onChange={(v) => setPref("autoplayNext", v)}
              />
              <Toggle
                label="Keep a mini-player when I navigate away"
                checked={miniPlayerOnLeave}
                onChange={(v) => setPref("miniPlayerOnLeave", v)}
              />
              <Toggle
                label="Reduced data mode"
                description="Mock — would cap quality and pause autoplay on metered networks."
                checked={reducedData}
                onChange={(v) => setPref("reducedData", v)}
              />
            </div>
          </section>

          <section id="notifications" className="solid-surface scroll-mt-24">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Control which mock notifications appear in your bell menu.
            </p>
            <div className="mt-3 divide-y divide-border-subtle">
              <Toggle label="Live alerts" description="When channels you follow go live." checked={notify.live} onChange={(v) => setNotify("live", v)} />
              <Toggle label="New clips" description="Fresh clips from followed creators." checked={notify.clips} onChange={(v) => setNotify("clips", v)} />
              <Toggle label="Replies & mentions" checked={notify.replies} onChange={(v) => setNotify("replies", v)} />
              <Toggle label="New followers" checked={notify.follows} onChange={(v) => setNotify("follows", v)} />
            </div>
          </section>

          <section id="accessibility" className="solid-surface scroll-mt-24">
            <h2 className="text-lg font-semibold">Accessibility</h2>
            <div className="mt-3 divide-y divide-border-subtle">
              <Toggle
                label="Audio-only playback"
                description="Hide video and show an audio visualizer. Useful for music and low-bandwidth viewing."
                checked={audioOnly}
                onChange={setAudioOnly}
              />
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-medium">Caption size</span>
              <div className="flex flex-wrap gap-2">
                {CAPTION_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCaptionStyle({ size: s })}
                    aria-pressed={captionStyle.size === s}
                    className={cn(captionStyle.size === s ? "pill-nav-active" : "pill-nav focus-ring")}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <span className="mb-2 block text-sm font-medium">Caption background</span>
              <div className="flex flex-wrap gap-2">
                {CAPTION_BACKGROUNDS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setCaptionStyle({ background: b })}
                    aria-pressed={captionStyle.background === b}
                    className={cn(captionStyle.background === b ? "pill-nav-active" : "pill-nav focus-ring")}
                  >
                    {b === "solid" ? "Solid" : b === "semi" ? "Semi" : "None"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-medium">Preview</span>
              <div className="relative flex aspect-video w-full max-w-md items-end justify-center overflow-hidden rounded-card bg-bg-stage p-4">
                <span
                  className="inline-block rounded px-2 py-1 text-center font-medium text-white"
                  style={{
                    fontSize: CAPTION_FONT_PX[captionStyle.size],
                    backgroundColor: captionBg,
                    textShadow:
                      captionStyle.background === "none" ? "0 1px 3px rgba(0,0,0,0.95)" : undefined,
                  }}
                >
                  This is how captions will look.
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-text-tertiary">
              Motion is automatically reduced when your system prefers reduced motion.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

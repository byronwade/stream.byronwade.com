"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/stores/session";
import { useUIStore } from "@/lib/stores/ui";
import { useNotificationSimulator } from "@/lib/mock/simulators";
import { cn } from "@/lib/utils/cn";
import { SearchPanel } from "./search-panel";
import { ToastRegion } from "./toast-region";
import { ConceptBanner } from "./concept-banner";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";
import { OnboardingTour } from "./onboarding-tour";
import { MiniPlayer } from "@/components/stream/mini-player";
import { ShortcutsOverlay } from "@/components/stream/keyboard-shortcuts";

const NAV_ITEMS = [
  { href: "/discover", label: "Browse" },
  { href: "/following", label: "Following" },
  { href: "/clips", label: "Clips" },
  { href: "/squad", label: "Squad" },
];

const MOBILE_NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/discover", label: "Browse", icon: "◎" },
  { href: "/following", label: "Follow", icon: "♥" },
  { href: "/clips", label: "Clips", icon: "✂" },
  { href: "/studio", label: "Studio", icon: "▣" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useSession();
  const { searchOpen, setSearchOpen, addToast } = useUIStore();
  const [accountOpen, setAccountOpen] = useState(false);

  // Global mock notification feed (browser-only; pushes into the notifications store).
  useNotificationSimulator(true);

  const isWatch = pathname.startsWith("/live/");
  const isAuth = pathname.startsWith("/auth/");
  const isStudio = pathname.startsWith("/studio");

  return (
    <div className="app-canvas flex min-h-screen flex-col">
      {!isAuth && <ConceptBanner />}
      {!isAuth && (
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-canvas/80 backdrop-blur-xl">
          <div className="section-shell flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-accent-primary">Stream</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "focus-ring rounded-chip px-3 py-1.5 text-sm font-medium transition-colors",
                      pathname === item.href || pathname.startsWith(item.href + "/")
                        ? "bg-white/10 text-text-primary"
                        : "text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="btn-secondary hidden px-4 py-2 text-sm sm:inline-flex"
                aria-label="Open search"
              >
                Search
              </button>
              {!isWatch && (
                <Link href="/schedule" className="btn-secondary hidden px-4 py-2 text-sm lg:inline-flex">
                  Schedule
                </Link>
              )}
              <NotificationBell />
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((o) => !o)}
                    className="btn-secondary px-4 py-2 text-sm"
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                  >
                    {user?.displayName ?? "Profile"}
                  </button>
                  {accountOpen && (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default"
                        aria-hidden
                        tabIndex={-1}
                        onClick={() => setAccountOpen(false)}
                      />
                      <div
                        role="menu"
                        className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-card border border-border-subtle bg-bg-elevated py-1 shadow-lg"
                      >
                        <Link
                          href="/studio"
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-bg-elevated-2 focus-ring"
                        >
                          Creator Studio
                        </Link>
                        <Link
                          href="/messages"
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-bg-elevated-2 focus-ring"
                        >
                          Messages
                        </Link>
                        <Link
                          href="/library/clips"
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-bg-elevated-2 focus-ring"
                        >
                          My clips
                        </Link>
                        <Link
                          href="/following"
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-bg-elevated-2 focus-ring"
                        >
                          Following
                        </Link>
                        <Link
                          href="/settings"
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-bg-elevated-2 focus-ring"
                        >
                          Settings
                        </Link>
                        <div className="border-t border-border-subtle px-4 py-2.5">
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                            Theme
                          </p>
                          <ThemeToggle size="sm" />
                        </div>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            logout();
                            setAccountOpen(false);
                            addToast("Signed out");
                            router.push("/");
                          }}
                          className="block w-full border-t border-border-subtle px-4 py-2 text-left text-sm text-text-secondary hover:bg-bg-elevated-2 hover:text-text-primary focus-ring"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="btn-primary px-4 py-2 text-sm">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={cn("flex-1", isStudio && "bg-bg-stage/30")}>{children}</main>

      {!isAuth && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-bg-canvas/90 backdrop-blur-xl md:hidden"
          aria-label="Mobile"
        >
          <div className="flex items-center justify-around py-2">
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs",
                  pathname === item.href ? "text-accent-primary" : "text-text-secondary",
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {!isAuth && (
        <footer className="border-t border-border-subtle py-6 pb-24 md:pb-6">
          <div className="section-shell flex flex-col gap-4 text-sm text-text-tertiary">
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Footer">
              <Link href="/about" className="hover:text-text-secondary focus-ring">
                About
              </Link>
              <Link href="/help" className="hover:text-text-secondary focus-ring">
                Help
              </Link>
              <Link href="/settings" className="hover:text-text-secondary focus-ring">
                Settings
              </Link>
              <Link href="/schedule" className="hover:text-text-secondary focus-ring">
                Schedule
              </Link>
              <span className="ml-auto">
                <ThemeToggle size="sm" />
              </span>
            </nav>
            <p>Stream is a frontend-only streaming platform concept with mocked backend flows.</p>
            <p>© 2026 Stream — Portfolio demonstration project.</p>
          </div>
        </footer>
      )}

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ToastRegion />
      <ShortcutsOverlay />
      <MiniPlayer />
      <OnboardingTour />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useNotifications } from "@/lib/stores/notification";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const KIND_ICON: Record<string, string> = {
  live: "🔴",
  clip: "✂",
  reply: "💬",
  follow: "✦",
  system: "ℹ",
};

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const mounted = useHydrated();

  const badge = mounted && unreadCount > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring relative rounded-chip border border-border-subtle bg-white/3 px-3 py-2 text-sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={badge ? `Notifications, ${unreadCount} unread` : "Notifications"}
      >
        <span aria-hidden>🔔</span>
        {badge && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-live px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 max-h-[70vh] w-80 overflow-y-auto rounded-card border border-border-subtle bg-bg-elevated shadow-panel"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
              <span className="text-sm font-semibold">Notifications</span>
              <button
                type="button"
                onClick={markAllRead}
                className="focus-ring rounded text-xs text-accent-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-text-tertiary">You&apos;re all caught up.</p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {notifications.slice(0, 12).map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href ?? "#"}
                      onClick={() => {
                        markRead(n.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "focus-ring block px-4 py-3 hover:bg-bg-elevated-2",
                        !n.read && "bg-accent-primary/5",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span aria-hidden className="mt-0.5 text-sm">
                          {KIND_ICON[n.kind] ?? "•"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{n.title}</p>
                          {n.body && <p className="truncate text-xs text-text-secondary">{n.body}</p>}
                          <p className="mt-0.5 text-[11px] text-text-tertiary">
                            {formatRelativeTime(n.createdAt)}
                          </p>
                        </div>
                        {!n.read && <span className="ml-auto mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-primary" />}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

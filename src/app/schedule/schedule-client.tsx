"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ReminderButton } from "@/components/stream/reminder-button";
import { cn } from "@/lib/utils/cn";

export interface ScheduleEvent {
  id: string;
  kind: "stream" | "schedule";
  title: string;
  startsAt: string;
  creatorName: string;
  href: string;
}

type View = "list" | "calendar";

export function ScheduleClient({ events }: { events: ScheduleEvent[] }) {
  const [view, setView] = useState<View>("list");

  const grouped = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const e of events) {
      const day = new Date(e.startsAt).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const list = map.get(day) ?? [];
      list.push(e);
      map.set(day, list);
    }
    return [...map.entries()];
  }, [events]);

  return (
    <>
      <div className="mt-6 flex gap-2" role="tablist" aria-label="Schedule view">
        {(["list", "calendar"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={cn(view === v ? "pill-nav-active" : "pill-nav focus-ring", "text-xs capitalize")}
          >
            {v}
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <p className="mt-8 text-text-secondary">No upcoming events.</p>
      ) : view === "list" ? (
        <ul className="mt-8 space-y-4">
          {events.map((e) => (
            <li key={`${e.kind}-${e.id}`} className="solid-surface flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link href={e.href} className="font-semibold hover:text-accent-primary focus-ring">
                  {e.title}
                </Link>
                <p className="text-sm text-text-secondary">{e.creatorName}</p>
                <p className="text-xs text-text-tertiary">{new Date(e.startsAt).toLocaleString()}</p>
              </div>
              <ReminderButton id={e.id} kind={e.kind} title={e.title} startsAt={e.startsAt} creatorName={e.creatorName} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 space-y-8">
          {grouped.map(([day, dayEvents]) => (
            <section key={day}>
              <h2 className="mb-3 border-b border-border-subtle pb-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                {day}
              </h2>
              <ul className="space-y-3">
                {dayEvents.map((e) => (
                  <li key={`${e.kind}-${e.id}`} className="solid-surface flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="shrink-0 rounded-lg bg-bg-elevated-2 px-3 py-2 text-center text-sm font-semibold tabular-nums">
                        {new Date(e.startsAt).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      <div>
                        <Link href={e.href} className="font-semibold hover:text-accent-primary focus-ring">
                          {e.title}
                        </Link>
                        <p className="text-sm text-text-secondary">{e.creatorName}</p>
                      </div>
                    </div>
                    <ReminderButton id={e.id} kind={e.kind} title={e.title} startsAt={e.startsAt} creatorName={e.creatorName} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

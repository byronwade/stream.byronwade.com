"use client";

import { useEffect, useRef, useState } from "react";
import { useWhispers } from "@/lib/stores/whisper";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function MessagesClient() {
  const { threads, sendMessage } = useWhispers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeId = selectedId ?? threads[0]?.id ?? null;
  const active = threads.find((t) => t.id === activeId) ?? null;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active?.messages.length, activeId]);

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-text-secondary">Mock whispers — replies are simulated and stored locally.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[300px_1fr]">
        <aside className="solid-surface p-0">
          <ul className="divide-y divide-border-subtle" aria-label="Conversations">
            {threads.map((t) => {
              const last = t.messages[t.messages.length - 1];
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    className={cn(
                      "focus-ring flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-elevated-2",
                      activeId === t.id && "bg-bg-elevated-2",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatarUrl} alt="" className="h-10 w-10 rounded-full bg-bg-elevated" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{t.withName}</span>
                      {last && <span className="block truncate text-xs text-text-secondary">{last.text}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="solid-surface flex min-h-[28rem] flex-col p-0">
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active.avatarUrl} alt="" className="h-9 w-9 rounded-full bg-bg-elevated" />
                <div>
                  <p className="text-sm font-semibold">{active.withName}</p>
                  <p className="text-xs text-text-tertiary">@{active.withHandle}</p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex flex-col", m.from === "you" ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                        m.from === "you"
                          ? "bg-accent-primary text-white"
                          : "border border-border-subtle bg-bg-elevated text-text-primary",
                      )}
                    >
                      {m.text}
                    </div>
                    <span className="mt-1 text-[11px] text-text-tertiary">{formatRelativeTime(m.sentAt)}</span>
                  </div>
                ))}
              </div>

              <form
                className="flex items-center gap-2 border-t border-border-subtle p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (draft.trim()) {
                    sendMessage(active.id, draft.trim());
                    setDraft("");
                  }
                }}
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${active.withName}...`}
                  className="input-field"
                  aria-label="Whisper message"
                />
                <button type="submit" className="btn-primary shrink-0 text-sm">
                  Send
                </button>
              </form>
            </>
          ) : (
            <p className="m-auto text-sm text-text-tertiary">No conversations yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

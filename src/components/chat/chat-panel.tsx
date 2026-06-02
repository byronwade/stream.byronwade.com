"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatMode, Emote, Poll, SubTier } from "@/lib/types";
import { useWatchPrefs } from "@/lib/stores/watch";
import { usePollVotes } from "@/lib/stores/poll";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";
import { EmoteText } from "./emote-text";
import { EmotePicker } from "./emote-picker";

/** Deterministic, display-only "this persona is a subscriber" marker for seeded chat. */
function seededSubTier(name: string): SubTier | 0 {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const r = h % 10;
  if (r < 5) return 0;
  if (r < 8) return 1;
  if (r < 9) return 2;
  return 3;
}

function SubBadge({ tier }: { tier: SubTier }) {
  return (
    <span
      className="ml-1 inline-flex items-center rounded bg-accent-secondary/20 px-1 text-[10px] font-bold text-accent-secondary"
      title={`Tier ${tier} subscriber`}
    >
      {tier}★
    </span>
  );
}

const TABS: { key: ChatMode; label: string }[] = [
  { key: "live", label: "Live" },
  { key: "questions", label: "Questions" },
  { key: "polls", label: "Polls" },
  { key: "highlights", label: "Highlights" },
];

interface ChatPanelProps {
  messages: ChatMessage[];
  healthScore: number;
  onSend?: (text: string) => void;
  onReportMessage?: (messageId: string) => void;
  /** Seeded polls for the current stream; rendered in the Polls tab with mock client voting. */
  polls?: Poll[];
  /** Emotes available for inline rendering + the picker. */
  emotes?: Emote[];
  /** The local viewer's sub tier for this channel (0 = not subscribed). */
  subscriberTier?: SubTier | 0;
  /** Hides the composer and shows a notice (used for ended VOD / scheduled streams). */
  readOnly?: boolean;
  readOnlyLabel?: string;
  emptyLabel?: string;
}

function PollList({ polls }: { polls: Poll[] }) {
  const { votedOption, vote } = usePollVotes();

  if (polls.length === 0) {
    return <p className="text-center text-sm text-text-tertiary">No polls for this stream yet.</p>;
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => {
        const chosen = votedOption(poll.id);
        const showResults = poll.status === "closed" || Boolean(chosen);
        const total =
          poll.options.reduce((sum, o) => sum + o.votes, 0) + (chosen ? 1 : 0);

        return (
          <div key={poll.id} className="rounded-card border border-border-subtle bg-bg-elevated p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{poll.question}</p>
              <span
                className={cn(
                  "shrink-0 rounded-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  poll.status === "open" ? "bg-success/15 text-success" : "bg-bg-elevated-2 text-text-tertiary",
                )}
              >
                {poll.status === "open" ? "Open" : "Closed"}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {poll.options.map((opt) => {
                const count = opt.votes + (chosen === opt.id ? 1 : 0);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const isChosen = chosen === opt.id;
                return (
                  <li key={opt.id}>
                    {showResults ? (
                      <div
                        className="relative overflow-hidden rounded-lg border border-border-subtle px-3 py-2 text-sm"
                        aria-label={`${opt.label}: ${pct}%`}
                      >
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0",
                            isChosen ? "bg-accent-primary/25" : "bg-white/5",
                          )}
                          style={{ width: `${pct}%` }}
                          aria-hidden
                        />
                        <span className="relative flex justify-between gap-2">
                          <span className={cn(isChosen && "font-semibold text-accent-primary")}>
                            {opt.label}
                            {isChosen && " ✓"}
                          </span>
                          <span className="tabular-nums text-text-secondary">{pct}%</span>
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => vote(poll.id, opt.id)}
                        className="focus-ring w-full rounded-lg border border-border-subtle px-3 py-2 text-left text-sm transition-colors hover:border-accent-primary/40 hover:bg-accent-primary/5"
                      >
                        {opt.label}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-[11px] text-text-tertiary">
              {showResults
                ? `${total.toLocaleString()} votes · your vote is mocked locally`
                : "Vote to see live results (mocked)"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function ChatPanel({
  messages,
  healthScore,
  onSend,
  onReportMessage,
  polls = [],
  emotes = [],
  subscriberTier = 0,
  readOnly = false,
  readOnlyLabel = "Chat is closed.",
  emptyLabel = "No messages in this tab yet.",
}: ChatPanelProps) {
  const { chatMode, setChatMode } = useWatchPrefs();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stickBottom, setStickBottom] = useState(true);
  const showPolls = chatMode === "polls";

  const filtered = messages.filter((m) => {
    if (m.flags.deleted) return false;
    if (chatMode === "questions") return m.flags.question;
    if (chatMode === "highlights") return m.flags.pinned;
    return true;
  });

  useEffect(() => {
    if (stickBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filtered.length, stickBottom]);

  const roleColors: Record<string, string> = {
    moderator: "text-warning",
    creator: "text-accent-primary",
    vip: "text-accent-secondary",
    bot: "text-text-tertiary",
    viewer: "text-text-secondary",
  };

  return (
    <div className="chat-card flex flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setChatMode(tab.key)}
              className={cn(
                "focus-ring shrink-0 rounded-chip px-3 py-1 text-xs font-medium transition-colors",
                chatMode === tab.key
                  ? "bg-accent-primary/20 text-accent-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="shrink-0 text-xs text-success">Health {healthScore}</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto p-4"
        onScroll={(e) => {
          const el = e.currentTarget;
          setStickBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
        }}
      >
        {showPolls ? (
          <PollList polls={polls} />
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-text-tertiary">{emptyLabel}</p>
        ) : (
          filtered.map((msg) => {
            const isYou = msg.authorId === "you";
            const tier = isYou ? subscriberTier : seededSubTier(msg.authorName);
            return (
            <div key={msg.id} className="group text-sm">
              <span className={cn("font-semibold", roleColors[msg.authorRole])}>{msg.authorName}</span>
              {tier > 0 && <SubBadge tier={tier as SubTier} />}
              {msg.flags.pinned && <span className="ml-1 text-xs text-warning">📌</span>}
              <span className="ml-2 text-text-primary">
                <EmoteText text={msg.text} emotes={emotes} />
              </span>
              <span className="ml-2 text-xs text-text-tertiary">{formatRelativeTime(msg.sentAt)}</span>
              {onReportMessage && (
                <button
                  type="button"
                  onClick={() => onReportMessage(msg.id)}
                  className="ml-2 hidden text-xs text-text-tertiary group-hover:inline focus-ring"
                >
                  Report
                </button>
              )}
            </div>
            );
          })
        )}
      </div>

      {readOnly ? (
        <p className="border-t border-border-subtle p-3 text-center text-xs text-text-tertiary">
          {readOnlyLabel}
        </p>
      ) : (
        <form
          className="flex items-center gap-2 border-t border-border-subtle p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) {
              onSend?.(draft.trim());
              setDraft("");
            }
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Send a message..."
            className="input-field"
            aria-label="Chat message"
          />
          {emotes.length > 0 && (
            <EmotePicker
              emotes={emotes}
              viewerTier={subscriberTier}
              onPick={(code) => setDraft((d) => `${d}${d && !d.endsWith(" ") ? " " : ""}:${code}: `)}
            />
          )}
        </form>
      )}
    </div>
  );
}

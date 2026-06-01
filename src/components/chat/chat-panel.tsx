"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatMode } from "@/lib/types";
import { useWatchPrefs } from "@/lib/stores/watch";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";

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
}

export function ChatPanel({ messages, healthScore, onSend, onReportMessage }: ChatPanelProps) {
  const { chatMode, setChatMode } = useWatchPrefs();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stickBottom, setStickBottom] = useState(true);

  const filtered = messages.filter((m) => {
    if (m.flags.deleted) return false;
    if (chatMode === "questions") return m.flags.question;
    if (chatMode === "highlights") return m.flags.pinned;
    if (chatMode === "polls") return m.text.toLowerCase().includes("poll");
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
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-text-tertiary">No messages in this tab yet.</p>
        ) : (
          filtered.map((msg) => (
            <div key={msg.id} className="group text-sm">
              <span className={cn("font-semibold", roleColors[msg.authorRole])}>{msg.authorName}</span>
              {msg.flags.pinned && <span className="ml-1 text-xs text-warning">📌</span>}
              <span className="ml-2 text-text-primary">{msg.text}</span>
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
          ))
        )}
      </div>

      <form
        className="border-t border-border-subtle p-3"
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
      </form>
    </div>
  );
}

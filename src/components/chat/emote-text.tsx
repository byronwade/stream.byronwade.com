"use client";

import { Fragment } from "react";
import type { Emote } from "@/lib/types";

/** Renders chat text, replacing `:code:` tokens with their emote glyphs. */
export function EmoteText({ text, emotes }: { text: string; emotes: Emote[] }) {
  if (!text.includes(":")) return <>{text}</>;
  const map = new Map(emotes.map((e) => [e.code, e]));
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Fresh regex per call (no shared mutable lastIndex) via matchAll.
  for (const match of text.matchAll(/:([a-zA-Z0-9_]+):/g)) {
    const emote = map.get(match[1]);
    if (!emote) continue;
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));
    parts.push(
      <span
        key={`${index}-${emote.code}`}
        className="inline-block align-middle text-base leading-none"
        title={emote.label}
        role="img"
        aria-label={emote.label}
      >
        {emote.char}
      </span>,
    );
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}

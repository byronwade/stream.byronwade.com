"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { getChatSeed } from "@/lib/data";
import { usePoints } from "@/lib/stores/points";
import { pushNotification } from "@/lib/stores/notification";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Replace any whole-word occurrence of a blocked term with asterisks (case-insensitive). */
export function maskBlockedTerms(text: string, terms: string[]): string {
  if (!terms || terms.length === 0) return text;
  let result = text;
  for (const term of terms) {
    const trimmed = term.trim();
    if (!trimmed) continue;
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "gi");
    result = result.replace(re, (match) => "*".repeat(match.length));
  }
  return result;
}

export function useViewerPulse(initialCount: number, enabled = true) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout>;

    const pulse = () => {
      setCount((prev) => {
        const change = prev * (randomBetween(-0.02, 0.03));
        return Math.max(1, Math.round(prev + change));
      });
      timeout = setTimeout(pulse, randomBetween(4000, 8000));
    };

    timeout = setTimeout(pulse, randomBetween(4000, 8000));
    return () => clearTimeout(timeout);
  }, [enabled]);

  return count;
}

export function useChatSimulator(
  streamId: string,
  tags: string[],
  enabled = true,
  blockedTerms: string[] = [],
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const seed = getChatSeed();
  // Keep the latest blocked terms in a ref so adding a term does not reset the simulator loop.
  const blockedRef = useRef(blockedTerms);
  useEffect(() => {
    blockedRef.current = blockedTerms;
  }, [blockedTerms]);

  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout>;

    const append = () => {
      const persona = seed.personas[Math.floor(Math.random() * seed.personas.length)];
      const tagKey = tags.find((t) => seed.tagTemplates[t]) ?? "default";
      const templates = seed.tagTemplates[tagKey] ?? seed.tagTemplates.default;
      const raw = templates[Math.floor(Math.random() * templates.length)];
      const text = maskBlockedTerms(raw, blockedRef.current);

      const msg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        streamId,
        authorId: persona.id,
        authorName: persona.name,
        authorRole: persona.role,
        text,
        sentAt: new Date().toISOString(),
        sentiment: "neutral",
        flags: { pinned: false, question: text.includes("?"), deleted: false, reported: false },
      };

      setMessages((prev) => [...prev.slice(-100), msg]);
      timeout = setTimeout(append, randomBetween(1200, 3500));
    };

    timeout = setTimeout(append, randomBetween(1200, 3500));
    return () => clearTimeout(timeout);
  }, [streamId, tags, enabled, seed]);

  return messages;
}

export function useAnalyticsSimulator(initialRetention: number[], enabled = true) {
  const [retention, setRetention] = useState(initialRetention);
  const ref = useRef(initialRetention);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      ref.current = [...ref.current.slice(1), ref.current[ref.current.length - 1] + randomBetween(-3, 2)];
      setRetention([...ref.current]);
    }, 10000);
    return () => clearInterval(interval);
  }, [enabled]);

  return retention;
}

export function useHealthSimulator(initialScore: number, enabled = true) {
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      setScore((prev) => Math.max(0, Math.min(100, Math.round(prev + randomBetween(-2, 2)))));
    }, 12000);
    return () => clearInterval(interval);
  }, [enabled]);

  return score;
}

export interface ActivityItem {
  id: string;
  label: string;
}

const ACTIVITY_POOL = [
  "New follower: PixelPioneer",
  "Clip created: Bridge complete moment",
  "Poll ended: Glass roofs win 62%",
  "New follower: studioFox",
  "Raid incoming: 240 viewers from @jazzdev",
  "Subscription: tier 1 from mossandmaple",
  "Bits cheered: 500 from buildmaster",
  "New follower: questgiver",
  "Highlight saved: market plaza reveal",
];

/**
 * Simulated studio activity feed. Seeds a few stable entries for SSR, then prepends
 * mock events on an interval while the tab is open. Browser-only; never networked.
 */
export function useActivityFeed(enabled = true, seedCount = 3): ActivityItem[] {
  const [items, setItems] = useState<ActivityItem[]>(() =>
    ACTIVITY_POOL.slice(0, seedCount).map((label, i) => ({ id: `seed_${i}`, label })),
  );

  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout>;
    const append = () => {
      const label = ACTIVITY_POOL[Math.floor(Math.random() * ACTIVITY_POOL.length)];
      setItems((prev) => [{ id: `act_${Date.now()}`, label }, ...prev].slice(0, 12));
      timeout = setTimeout(append, randomBetween(6000, 12000));
    };
    timeout = setTimeout(append, randomBetween(6000, 12000));
    return () => clearTimeout(timeout);
  }, [enabled]);

  return items;
}

/**
 * Accrues mock channel points to a creator while the viewer is "watching" a live
 * stream. Browser-only; writes to the localStorage points store on an interval.
 * Returns the live balance for the channel.
 */
export function usePointsAccrual(creatorId: string, enabled = true, perTick = 10) {
  const { balanceFor, accrue } = usePoints();
  const accrueRef = useRef(accrue);
  useEffect(() => {
    accrueRef.current = accrue;
  }, [accrue]);

  useEffect(() => {
    if (!enabled || !creatorId) return;
    const interval = setInterval(() => {
      accrueRef.current(creatorId, perTick);
    }, 12000);
    return () => clearInterval(interval);
  }, [creatorId, enabled, perTick]);

  return balanceFor(creatorId);
}

const NOTIFICATION_POOL: Array<{ kind: "live" | "clip" | "reply" | "follow"; title: string; body: string; href?: string }> = [
  { kind: "live", title: "Cozy Gamer is live", body: "Cozy Stardew Sunday — farm expansion", href: "/live/cozy-stardew-sunday" },
  { kind: "clip", title: "New clip is trending", body: "Aerial goal from RocketRage", href: "/clips" },
  { kind: "reply", title: "Someone replied to you", body: "Great point in chat just now", href: "/messages" },
  { kind: "follow", title: "Nova Keys went live", body: "Midnight piano improv & requests", href: "/live/midnight-piano-improv" },
  { kind: "live", title: "Beat Forge is live", body: "Lo-fi beat production from scratch", href: "/live/lofi-beat-production" },
];

/**
 * Periodically pushes mock notifications into the notifications store while the
 * app is open. Runs once globally (mount in a provider). Browser-only.
 */
export function useNotificationSimulator(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const next = NOTIFICATION_POOL[Math.floor(Math.random() * NOTIFICATION_POOL.length)];
      pushNotification(next);
      timeout = setTimeout(tick, randomBetween(28000, 52000));
    };
    timeout = setTimeout(tick, randomBetween(28000, 52000));
    return () => clearTimeout(timeout);
  }, [enabled]);
}

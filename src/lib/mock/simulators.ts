"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { getChatSeed } from "@/lib/data";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
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

export function useChatSimulator(streamId: string, tags: string[], enabled = true) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const seed = getChatSeed();

  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout>;

    const append = () => {
      const persona = seed.personas[Math.floor(Math.random() * seed.personas.length)];
      const tagKey = tags.find((t) => seed.tagTemplates[t]) ?? "default";
      const templates = seed.tagTemplates[tagKey] ?? seed.tagTemplates.default;
      const text = templates[Math.floor(Math.random() * templates.length)];

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

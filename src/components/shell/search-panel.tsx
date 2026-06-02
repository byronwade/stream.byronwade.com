"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { searchAll } from "@/lib/data";
import { cn } from "@/lib/utils/cn";
import { BloomLayer } from "@/components/bloom/bloom-layer";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "streams" | "creators" | "categories" | "clips";

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("streams");
  const results = query.length >= 2 ? searchAll(query) : null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const tabs: { key: Tab; label: string; count: number }[] = results
    ? [
        { key: "streams", label: "Streams", count: results.streams.length },
        { key: "creators", label: "Creators", count: results.creators.length },
        { key: "categories", label: "Categories", count: results.categories.length },
        { key: "clips", label: "Clips", count: results.clips.length },
      ]
    : [];

  const totalResults = results
    ? results.streams.length + results.creators.length + results.categories.length + results.clips.length
    : 0;

  return (
    <BloomLayer open={open} onClose={onClose} title="Search" className="max-w-xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search streams, creators, categories..."
        className="input-field mb-4"
        autoFocus
        aria-label="Search query"
      />

      {results && totalResults === 0 && (
        <p className="py-6 text-center text-sm text-text-tertiary">
          No results for &ldquo;{query}&rdquo;. Try a different search.
        </p>
      )}

      {results && totalResults > 0 && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(tab === t.key ? "pill-nav-active" : "pill-nav focus-ring text-xs")}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          <ul className="space-y-2">
            {tab === "streams" &&
              results.streams.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/live/${s.slug}`}
                    onClick={onClose}
                    className="block rounded-xl border border-border-subtle bg-bg-elevated p-3 hover:bg-bg-elevated-2 focus-ring"
                  >
                    <span className="font-medium">{s.title}</span>
                    {s.state === "live" && <span className="live-badge ml-2">Live</span>}
                  </Link>
                </li>
              ))}
            {tab === "creators" &&
              results.creators.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/channels/${c.handle}`}
                    onClick={onClose}
                    className="block rounded-xl border border-border-subtle bg-bg-elevated p-3 hover:bg-bg-elevated-2 focus-ring"
                  >
                    {c.displayName} <span className="text-text-tertiary">@{c.handle}</span>
                  </Link>
                </li>
              ))}
            {tab === "categories" &&
              results.categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    onClick={onClose}
                    className="block rounded-xl border border-border-subtle bg-bg-elevated p-3 hover:bg-bg-elevated-2 focus-ring"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            {tab === "clips" &&
              results.clips.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/clips/${c.id}`}
                    onClick={onClose}
                    className="block rounded-xl border border-border-subtle bg-bg-elevated p-3 hover:bg-bg-elevated-2 focus-ring"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
          </ul>

          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="mt-4 block text-center text-sm text-accent-primary hover:underline focus-ring"
          >
            See all results for &ldquo;{query}&rdquo;
          </Link>
        </>
      )}
    </BloomLayer>
  );
}

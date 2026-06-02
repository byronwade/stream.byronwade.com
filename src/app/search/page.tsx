"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchAll } from "@/lib/data";

function SearchContent() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const results = query.length >= 2 ? searchAll(query) : null;
  const total = results
    ? results.streams.length + results.creators.length + results.categories.length + results.clips.length
    : 0;

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search streams, creators, categories, clips..."
        className="input-field mt-6 max-w-xl"
        aria-label="Search"
        autoFocus
      />

      {results && total === 0 && (
        <p className="mt-8 text-text-secondary">
          No results for &ldquo;{query}&rdquo;. Try a different search.
        </p>
      )}

      {results && total > 0 && (
        <div className="mt-8 space-y-8">
          {results.streams.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">Streams</h2>
              <ul className="space-y-2">
                {results.streams.map((s) => (
                  <li key={s.id}>
                    <Link href={`/live/${s.slug}`} className="text-accent-primary hover:underline">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {results.creators.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">Creators</h2>
              <ul className="space-y-2">
                {results.creators.map((c) => (
                  <li key={c.id}>
                    <Link href={`/channels/${c.handle}`} className="text-accent-primary hover:underline">
                      {c.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {results.categories.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">Categories</h2>
              <ul className="space-y-2">
                {results.categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/categories/${c.slug}`} className="text-accent-primary hover:underline">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {results.clips.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">Clips</h2>
              <ul className="space-y-2">
                {results.clips.map((c) => (
                  <li key={c.id}>
                    <Link href={`/clips/${c.id}`} className="text-accent-primary hover:underline">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Search</h1>
      <Suspense fallback={<p className="mt-6 text-text-secondary">Loading search…</p>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { searchAll } from "@/lib/data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = query.length >= 2 ? searchAll(query) : null;

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Search</h1>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search streams, creators, categories, clips..."
        className="input-field mt-6 max-w-xl"
        aria-label="Search"
      />

      {results && (
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
    </div>
  );
}

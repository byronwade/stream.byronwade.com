import { describe, it, expect } from "vitest";
import {
  getAllStreams,
  filterStreams,
  searchAll,
  getPollsByStreamId,
  getStreamsWithAnalytics,
} from "../data";

describe("filterStreams", () => {
  it("returns every stream when no filters are applied", () => {
    expect(filterStreams({}).length).toBe(getAllStreams().length);
  });

  it("sorts by discovery fit score by default (descending)", () => {
    const result = filterStreams({});
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].discovery.fitScore).toBeGreaterThanOrEqual(result[i].discovery.fitScore);
    }
  });

  it("sorts by viewers descending when requested", () => {
    const result = filterStreams({ sort: "viewers" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].viewerCount).toBeGreaterThanOrEqual(result[i].viewerCount);
    }
  });

  it("filters small communities to under 500 viewers", () => {
    const result = filterStreams({ size: "small" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((s) => s.viewerCount < 500)).toBe(true);
  });

  it("filters large communities to 2000+ viewers", () => {
    const result = filterStreams({ size: "large" });
    expect(result.every((s) => s.viewerCount >= 2000)).toBe(true);
  });

  it("filters by mood using a mood present in the data", () => {
    const mood = getAllStreams().flatMap((s) => s.moods)[0];
    const result = filterStreams({ mood });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((s) => s.moods.includes(mood))).toBe(true);
  });

  it("matches a query against stream titles", () => {
    const sample = getAllStreams()[0];
    const word = sample.title.split(" ")[0];
    const result = filterStreams({ query: word });
    expect(result.some((s) => s.id === sample.id)).toBe(true);
  });

  it("returns an empty list for a query that matches nothing", () => {
    expect(filterStreams({ query: "zzz-no-such-stream-zzz" })).toHaveLength(0);
  });
});

describe("searchAll", () => {
  it("returns grouped results across entities", () => {
    const results = searchAll("a");
    expect(results).toHaveProperty("streams");
    expect(results).toHaveProperty("creators");
    expect(results).toHaveProperty("categories");
    expect(results).toHaveProperty("clips");
  });

  it("finds a stream by a word in its title", () => {
    const sample = getAllStreams()[0];
    const word = sample.title.split(" ")[0];
    const results = searchAll(word);
    expect(results.streams.some((s) => s.id === sample.id)).toBe(true);
  });
});

describe("poll + analytics helpers", () => {
  it("only returns polls belonging to a stream", () => {
    const polls = getPollsByStreamId("stream_001");
    expect(polls.length).toBeGreaterThan(0);
    expect(polls.every((p) => p.streamId === "stream_001")).toBe(true);
  });

  it("only returns streams that have analytics snapshots", () => {
    const streams = getStreamsWithAnalytics();
    expect(streams.length).toBeGreaterThan(1);
  });
});

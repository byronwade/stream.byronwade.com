import { describe, it, expect } from "vitest";
import {
  resolveCatchUpMoments,
  validateClipTrim,
  shouldShowJoinLate,
} from "../utils/catch-up";
import type { Stream } from "../types";

const mockStream: Stream = {
  id: "stream_test",
  slug: "test",
  creatorId: "c1",
  title: "Test",
  description: "",
  categorySlug: "gaming",
  tags: [],
  moods: ["chill"],
  state: "live",
  startedAt: new Date(Date.now() - 3600000).toISOString(),
  scheduledFor: null,
  viewerCount: 100,
  peakViewerCount: 100,
  language: "en",
  thumbnailUrl: "/t.jpg",
  posterUrl: "/p.jpg",
  videoUrl: "/v.mp4",
  durationSeconds: 3600,
  health: {
    overall: "good",
    bitrateKbps: 4000,
    droppedFramesPct: 0,
    chatHealthScore: 90,
    creatorResponseRate: 50,
    newViewerFriendlyScore: 80,
  },
  catchUp: {
    headline: "Test",
    currentTopic: "Topic",
    summary: "Summary",
    moments: [
      { atSecond: 100, label: "A", summary: "First" },
      { atSecond: 500, label: "B", summary: "Second" },
      { atSecond: 900, label: "C", summary: "Third" },
    ],
  },
  timeline: [
    { id: "e1", atSecond: 100, type: "moment", title: "A", summary: "First" },
    { id: "e2", atSecond: 500, type: "poll", title: "B", summary: "Second" },
  ],
  discovery: {
    fitScore: 0.9,
    smallCommunityBoost: 0.1,
    retentionScore: 0.8,
    recommendationReason: "Test",
  },
};

describe("catch-up resolver", () => {
  it("returns moments before current time", () => {
    const { moments } = resolveCatchUpMoments(mockStream, 600);
    expect(moments.length).toBeGreaterThan(0);
    expect(moments.every((m) => m.atSecond <= 600)).toBe(true);
  });

  it("validates clip trim bounds", () => {
    expect(validateClipTrim(10, 30, 100).valid).toBe(true);
    expect(validateClipTrim(10, 12, 100).valid).toBe(false);
    expect(validateClipTrim(90, 200, 100).valid).toBe(false);
  });

  it("detects join late for live streams", () => {
    expect(shouldShowJoinLate(mockStream)).toBe(true);
  });
});

describe("discovery scoring helpers", () => {
  it("validates clip minimum duration message", () => {
    const result = validateClipTrim(0, 3, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("5 seconds");
  });
});

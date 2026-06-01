import streamsData from "@/data/streams.json";
import creatorsData from "@/data/creators.json";
import categoriesData from "@/data/categories.json";
import clipsData from "@/data/clips.json";
import analyticsData from "@/data/analytics.json";
import chatSeedData from "@/data/chat-seed.json";
import type {
  AnalyticsSnapshot,
  Category,
  ChatSeed,
  Clip,
  Creator,
  Mood,
  Stream,
} from "@/lib/types";

const streams = streamsData as Stream[];
const creators = creatorsData as Creator[];
const categories = categoriesData as Category[];
const clips = clipsData as Clip[];
const analytics = analyticsData as AnalyticsSnapshot[];
const chatSeed = chatSeedData as ChatSeed;

export function getAllStreams(): Stream[] {
  return streams;
}

export function getStreamBySlug(slug: string): Stream | undefined {
  return streams.find((s) => s.slug === slug);
}

export function getStreamById(id: string): Stream | undefined {
  return streams.find((s) => s.id === id);
}

export function getLiveStreams(): Stream[] {
  return streams.filter((s) => s.state === "live");
}

export function getScheduledStreams(): Stream[] {
  return streams.filter((s) => s.state === "scheduled");
}

export function getAllCreators(): Creator[] {
  return creators;
}

export function getCreatorByHandle(handle: string): Creator | undefined {
  return creators.find((c) => c.handle === handle);
}

export function getCreatorById(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}

export function getStreamsByCategory(categorySlug: string): Stream[] {
  return streams.filter((s) => s.categorySlug === categorySlug);
}

export function getStreamsByCreatorId(creatorId: string): Stream[] {
  return streams.filter((s) => s.creatorId === creatorId);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllClips(): Clip[] {
  return clips;
}

export function getClipById(id: string): Clip | undefined {
  return clips.find((c) => c.id === id);
}

export function getClipsByStreamId(streamId: string): Clip[] {
  return clips.filter((c) => c.streamId === streamId);
}

export function getClipsByCreatorId(creatorId: string): Clip[] {
  return clips.filter((c) => c.creatorId === creatorId);
}

export function getAnalyticsByStreamId(streamId: string): AnalyticsSnapshot[] {
  return analytics.filter((a) => a.streamId === streamId);
}

export function getChatSeed(): ChatSeed {
  return chatSeed;
}

export function getFeaturedStream(): Stream {
  return streams.find((s) => s.slug === "forest-city-build") ?? streams[0];
}

export function getRisingCreators(limit = 6): Creator[] {
  return [...creators]
    .sort((a, b) => b.stats.newViewerResponseRate - a.stats.newViewerResponseRate)
    .slice(0, limit);
}

export type DiscoveryFilters = {
  mood?: Mood;
  size?: "small" | "medium" | "large";
  sort?: "fit" | "viewers" | "recent";
  query?: string;
};

export function filterStreams(filters: DiscoveryFilters): Stream[] {
  let result = [...streams];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q)) ||
        getCreatorById(s.creatorId)?.displayName.toLowerCase().includes(q),
    );
  }

  if (filters.mood) {
    result = result.filter((s) => s.moods.includes(filters.mood!));
  }

  if (filters.size === "small") {
    result = result.filter((s) => s.viewerCount < 500);
  } else if (filters.size === "medium") {
    result = result.filter((s) => s.viewerCount >= 500 && s.viewerCount < 2000);
  } else if (filters.size === "large") {
    result = result.filter((s) => s.viewerCount >= 2000);
  }

  if (filters.sort === "viewers") {
    result.sort((a, b) => b.viewerCount - a.viewerCount);
  } else if (filters.sort === "recent") {
    result.sort((a, b) => {
      const aTime = a.startedAt ?? a.scheduledFor ?? "";
      const bTime = b.startedAt ?? b.scheduledFor ?? "";
      return bTime.localeCompare(aTime);
    });
  } else {
    result.sort((a, b) => b.discovery.fitScore - a.discovery.fitScore);
  }

  return result;
}

export function searchAll(query: string) {
  const q = query.toLowerCase();
  return {
    streams: streams.filter(
      (s) => s.title.toLowerCase().includes(q) || s.tags.some((t) => t.includes(q)),
    ),
    creators: creators.filter(
      (c) => c.displayName.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q),
    ),
    categories: categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.topTags.some((t) => t.includes(q)),
    ),
    clips: clips.filter((c) => c.title.toLowerCase().includes(q)),
  };
}

export function getAllStreamSlugs(): string[] {
  return streams.map((s) => s.slug);
}

export function getAllCreatorHandles(): string[] {
  return creators.map((c) => c.handle);
}

export function getAllCategorySlugs(): string[] {
  return categories.map((c) => c.slug);
}

export function getAllClipIds(): string[] {
  return clips.map((c) => c.id);
}

export type StreamHealth = "excellent" | "good" | "warning" | "critical";
export type ChatMode = "live" | "questions" | "polls" | "highlights";
export type StreamState = "scheduled" | "warmup" | "live" | "ended";
export type Mood =
  | "chill"
  | "learn"
  | "laugh"
  | "competitive"
  | "small-community"
  | "creative"
  | "background"
  | "deep-focus";

export interface Stream {
  id: string;
  slug: string;
  creatorId: string;
  title: string;
  description: string;
  categorySlug: string;
  tags: string[];
  moods: Mood[];
  state: StreamState;
  startedAt: string | null;
  scheduledFor: string | null;
  viewerCount: number;
  peakViewerCount: number;
  language: string;
  thumbnailUrl: string;
  posterUrl: string;
  videoUrl: string;
  hlsUrl?: string;
  durationSeconds: number;
  liveLatencyMs?: number;
  health: {
    overall: StreamHealth;
    bitrateKbps: number;
    droppedFramesPct: number;
    chatHealthScore: number;
    creatorResponseRate: number;
    newViewerFriendlyScore: number;
  };
  catchUp: {
    headline: string;
    currentTopic: string;
    summary: string;
    moments: Array<{
      atSecond: number;
      label: string;
      summary: string;
      imageUrl?: string;
    }>;
  };
  timeline: Array<{
    id: string;
    atSecond: number;
    type: "moment" | "poll" | "goal" | "mod-action" | "context";
    title: string;
    summary: string;
  }>;
  discovery: {
    fitScore: number;
    smallCommunityBoost: number;
    retentionScore: number;
    recommendationReason: string;
  };
}

export interface Creator {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  verified: boolean;
  liveStreamId?: string;
  followerCount: number;
  schedule: Array<{
    id: string;
    title: string;
    startsAt: string;
    categorySlug: string;
  }>;
  stats: {
    averageViewers: number;
    chatHealthAverage: number;
    streamConsistencyScore: number;
    newViewerResponseRate: number;
  };
  links: Array<{ label: string; href: string }>;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  authorId: string;
  authorName: string;
  authorRole: "viewer" | "moderator" | "creator" | "vip" | "bot";
  text: string;
  sentAt: string;
  sentiment: "positive" | "neutral" | "negative";
  flags: {
    pinned: boolean;
    question: boolean;
    deleted: boolean;
    reported: boolean;
  };
}

export interface Clip {
  id: string;
  streamId: string;
  creatorId: string;
  title: string;
  slug: string;
  startSecond: number;
  endSecond: number;
  durationSeconds: number;
  posterUrl: string;
  mp4Url: string;
  createdByUserId: string;
  createdAt: string;
  views: number;
  likes: number;
  shareUrl: string;
}

export interface Category {
  slug: string;
  name: string;
  heroImage: string;
  description: string;
  topTags: string[];
  featuredCreatorIds: string[];
}

export interface AnalyticsSnapshot {
  streamId: string;
  timestamp: string;
  viewers: number;
  retention: number[];
  followsGained: number;
  clipsCreated?: number;
  avgWatchTime?: number;
}

export interface Report {
  id: string;
  subjectType: "stream" | "user" | "message";
  subjectId: string;
  reason: string;
  notes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface LayoutPreset {
  id: string;
  route: string;
  widgetOrder: string[];
  widgetSizes?: Record<string, { w: number; h: number }>;
  hiddenWidgets?: string[];
}

export interface UserSession {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  pin?: string;
  isCreator: boolean;
}

export interface ChatPersona {
  id: string;
  name: string;
  role: ChatMessage["authorRole"];
  templates: string[];
}

export interface ChatSeed {
  personas: ChatPersona[];
  tagTemplates: Record<string, string[]>;
}

export const MOODS: { value: Mood; label: string }[] = [
  { value: "chill", label: "Chill" },
  { value: "learn", label: "Learn" },
  { value: "laugh", label: "Laugh" },
  { value: "competitive", label: "Competitive" },
  { value: "small-community", label: "Small Communities" },
  { value: "creative", label: "Creative" },
  { value: "background", label: "Background" },
  { value: "deep-focus", label: "Deep Focus" },
];

export type PanelType = "catch-up" | "clip" | "report" | "creator" | "filter" | "analytics";

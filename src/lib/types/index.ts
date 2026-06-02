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
  chapters?: Chapter[];
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

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  streamId: string;
  question: string;
  options: PollOption[];
  status: "open" | "closed";
  totalSeedVotes: number;
}

export interface Reminder {
  id: string;
  streamId?: string;
  scheduleId?: string;
  title: string;
  startsAt: string | null;
  creatorName?: string;
  createdAt: string;
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

export type PanelType =
  | "catch-up"
  | "clip"
  | "report"
  | "creator"
  | "filter"
  | "analytics"
  | "subscribe"
  | "predict"
  | "rewards";

// ---------------------------------------------------------------------------
// Net-new feature types (engagement, viewer-xp, studio, theming)
// ---------------------------------------------------------------------------

/** VOD chapter marker; seeded on `ended` streams for the replay seek list. */
export interface Chapter {
  id: string;
  atSecond: number;
  title: string;
}

export type ThemeMode = "light" | "dark" | "system";

export type CaptionSize = "sm" | "md" | "lg" | "xl";
export type CaptionBackground = "solid" | "semi" | "none";

/** Player caption styling, persisted in the watch store and applied via ::cue. */
export interface CaptionStyle {
  size: CaptionSize;
  background: CaptionBackground;
}

export type SubTier = 1 | 2 | 3;

export interface SubscriptionTierInfo {
  tier: SubTier;
  label: string;
  priceLabel: string;
  perks: string[];
}

/** A mock subscription to a creator's channel, stored in the subscription store. */
export interface Subscription {
  creatorId: string;
  tier: SubTier;
  since: string;
}

/** An emote that can be rendered inline in chat. `tier` gates it behind a sub tier. */
export interface Emote {
  code: string;
  char: string;
  label: string;
  tier?: SubTier;
  creatorId?: string;
}

export interface EmoteSet {
  global: Emote[];
  channels: Record<string, Emote[]>;
}

export interface PredictionOutcome {
  id: string;
  label: string;
  color: "blue" | "pink";
  seedPoints: number;
  seedVoters: number;
}

export interface Prediction {
  id: string;
  streamId: string;
  title: string;
  status: "open" | "locked" | "resolved";
  outcomes: PredictionOutcome[];
  winningOutcomeId?: string | null;
}

/** A mock channel-points redemption reward. */
export interface Reward {
  id: string;
  label: string;
  cost: number;
  description: string;
}

export interface WhisperMessage {
  id: string;
  from: "you" | "them";
  text: string;
  sentAt: string;
}

export interface WhisperThread {
  id: string;
  withName: string;
  withHandle: string;
  avatarUrl: string;
  messages: WhisperMessage[];
}

export type NotificationKind = "live" | "clip" | "reply" | "follow" | "system";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  href?: string;
  createdAt: string;
  read: boolean;
}

export type AlertStyle = "minimal" | "hype" | "retro";

/** Studio alert-box + follower-goal configuration. */
export interface AlertSettings {
  style: AlertStyle;
  accent: string;
  message: string;
  sound: boolean;
  goalLabel: string;
  goalCurrent: number;
  goalTarget: number;
}

/** A mock restream destination (label + clearly-fake key only). */
export interface RestreamTarget {
  id: string;
  platform: string;
  enabled: boolean;
  streamKey: string;
}

export const SUB_TIERS: SubscriptionTierInfo[] = [
  { tier: 1, label: "Tier 1", priceLabel: "$4.99/mo", perks: ["Ad-free viewing", "Tier 1 emotes", "Sub badge"] },
  { tier: 2, label: "Tier 2", priceLabel: "$9.99/mo", perks: ["Everything in Tier 1", "Tier 2 emotes", "Loyalty badge"] },
  { tier: 3, label: "Tier 3", priceLabel: "$24.99/mo", perks: ["Everything in Tier 2", "Tier 3 emotes", "Priority whispers"] },
];

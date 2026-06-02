"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BloomLayer } from "@/components/bloom/bloom-layer";
import { CatchMeUpPanel } from "@/components/chat/catch-me-up-panel";
import { ChatPanel } from "@/components/chat/chat-panel";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";
import { CinematicPlayer, type SeekSignal } from "@/components/stream/cinematic-player";
import { WatchFilterPanel } from "@/components/stream/watch-filter-panel";
import { WatchAnalyticsPanel } from "@/components/stream/watch-analytics-panel";
import { ChannelPointsPanel } from "@/components/stream/channel-points-panel";
import { PredictionPanel } from "@/components/stream/prediction-panel";
import { SubscribeDialog } from "@/components/creator/subscribe-dialog";
import { PillNav } from "@/components/shell/pill-nav";
import { StreamCard } from "@/components/stream/stream-card";
import { useMiniPlayer } from "@/components/stream/mini-player";
import {
  getCreatorById,
  getClipsByStreamId,
  getPollsByStreamId,
  getEmotesForStream,
  getPredictionsByStreamId,
} from "@/lib/data";
import type { ChatMessage, Stream } from "@/lib/types";
import {
  maskBlockedTerms,
  useChatSimulator,
  useHealthSimulator,
  useViewerPulse,
  usePointsAccrual,
} from "@/lib/mock/simulators";
import { useReports } from "@/lib/stores/report";
import { useReminders } from "@/lib/stores/reminder";
import { useFollows } from "@/lib/stores/follow";
import { useSubscriptions } from "@/lib/stores/subscription";
import { useViewerPrefs } from "@/lib/stores/prefs";
import { recordHistory } from "@/lib/stores/history";
import { useUIStore } from "@/lib/stores/ui";
import { shouldShowJoinLate } from "@/lib/utils/catch-up";
import { formatDuration, formatViewerCount } from "@/lib/utils/format";

const ClipComposer = dynamic(
  () => import("@/components/stream/clip-composer").then((m) => m.ClipComposer),
  { ssr: false },
);
const ReportDialog = dynamic(
  () => import("@/components/stream/report-dialog").then((m) => m.ReportDialog),
  { ssr: false },
);

interface WatchPageClientProps {
  stream: Stream;
  relatedStreams: Stream[];
}

export function WatchPageClient({ stream, relatedStreams }: WatchPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const panel = searchParams.get("panel");
  const creator = getCreatorById(stream.creatorId)!;
  const clips = getClipsByStreamId(stream.id);
  const polls = getPollsByStreamId(stream.id);
  const emotes = getEmotesForStream(stream.creatorId);
  const predictions = getPredictionsByStreamId(stream.id);

  const isLive = stream.state === "live";
  const isEnded = stream.state === "ended";
  const isScheduled = stream.state === "scheduled";
  const hasVideo = !isScheduled;

  const [currentTime, setCurrentTime] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [seekSignal, setSeekSignal] = useState<SeekSignal | null>(null);

  const { blockedTerms } = useReports();
  const { hasReminder, toggleReminder } = useReminders();
  const { isFollowingStream, toggleStream } = useFollows();
  const { tierFor } = useSubscriptions();
  const { miniPlayerOnLeave } = useViewerPrefs();
  const { setActive } = useMiniPlayer();
  const { addToast, setShortcutsOpen } = useUIStore();

  const subTier = tierFor(stream.creatorId);
  const viewerCount = useViewerPulse(stream.viewerCount, isLive);
  const simMessages = useChatSimulator(stream.id, stream.tags, isLive, blockedTerms);
  const healthScore = useHealthSimulator(stream.health.chatHealthScore, isLive);
  const pointsBalance = usePointsAccrual(stream.creatorId, isLive);

  // Record watch history and (optionally) hand off to the persistent mini-player.
  useEffect(() => {
    if (!hasVideo) return;
    recordHistory({ id: stream.id, slug: stream.slug, kind: "stream" });
    if (miniPlayerOnLeave) {
      setActive({
        slug: stream.slug,
        title: stream.title,
        creatorName: creator.displayName,
        videoUrl: stream.videoUrl,
        posterUrl: stream.posterUrl,
      });
    }
  }, [
    hasVideo,
    miniPlayerOnLeave,
    setActive,
    stream.id,
    stream.slug,
    stream.title,
    stream.videoUrl,
    stream.posterUrl,
    creator.displayName,
  ]);

  const allMessages = [...simMessages, ...localMessages];
  const notified = hasReminder(stream.id);
  const followingStream = isFollowingStream(stream.id);

  const setPanel = useCallback(
    (p: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (p) params.set("panel", p);
      else params.delete("panel");
      router.push(`/live/${stream.slug}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, stream.slug],
  );

  const handleSend = useCallback(
    (text: string) => {
      const masked = maskBlockedTerms(text, blockedTerms);
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `local_${Date.now()}`,
          streamId: stream.id,
          authorId: "you",
          authorName: "You",
          authorRole: "viewer",
          text: masked,
          sentAt: new Date().toISOString(),
          sentiment: "neutral",
          flags: { pinned: false, question: masked.includes("?"), deleted: false, reported: false },
        },
      ]);
    },
    [blockedTerms, stream.id],
  );

  const seekTo = useCallback(
    (seconds: number) => {
      setSeekSignal({ seconds, nonce: Date.now() });
      setPanel(null);
      addToast(`Jumped to ${formatDuration(seconds)}`);
    },
    [setPanel, addToast],
  );

  const handleNotify = useCallback(() => {
    const set = toggleReminder({
      streamId: stream.id,
      title: stream.title,
      startsAt: stream.scheduledFor,
      creatorName: creator.displayName,
    });
    addToast(set ? "Reminder set — we'll mock a nudge before it starts." : "Reminder removed.");
  }, [toggleReminder, stream.id, stream.title, stream.scheduledFor, creator.displayName, addToast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setPanel]);

  const contextPills = [
    ...(hasVideo
      ? [{ key: "catch-up", label: isEnded ? "Recap" : "Catch Me Up", onClick: () => setPanel("catch-up") }]
      : []),
    ...(hasVideo ? [{ key: "clip", label: "Clip", onClick: () => setPanel("clip") }] : []),
    { key: "subscribe", label: subTier ? `Subscribed · T${subTier}` : "Subscribe", onClick: () => setPanel("subscribe") },
    ...(isLive ? [{ key: "rewards", label: "Channel points", onClick: () => setPanel("rewards") }] : []),
    ...(predictions.length > 0 ? [{ key: "predict", label: "Predictions", onClick: () => setPanel("predict") }] : []),
    { key: "report", label: "Report", onClick: () => setPanel("report") },
    { key: "creator", label: "Creator", onClick: () => setPanel("creator") },
    { key: "filter", label: "Preferences", onClick: () => setPanel("filter") },
    ...(hasVideo ? [{ key: "analytics", label: "Analytics", onClick: () => setPanel("analytics") }] : []),
  ];

  const statusLine = isLive
    ? `${formatViewerCount(viewerCount)} watching · Health ${healthScore}/100 · ${pointsBalance.toLocaleString()} pts`
    : isEnded
      ? `VOD · ${formatViewerCount(stream.peakViewerCount)} peak viewers`
      : stream.scheduledFor
        ? `Scheduled for ${new Date(stream.scheduledFor).toLocaleString()}`
        : "Scheduled";

  return (
    <div className="section-shell py-6">
      {shouldShowJoinLate(stream) && panel !== "catch-up" && (
        <div className="mb-4 rounded-xl border border-accent-primary/30 bg-accent-primary/10 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">You joined late — want a quick summary?</p>
          <button type="button" onClick={() => setPanel("catch-up")} className="btn-primary text-sm">
            Catch Me Up
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <CinematicPlayer
            stream={stream}
            onTimeUpdate={setCurrentTime}
            onClipRequest={() => setPanel("clip")}
            seekSignal={seekSignal}
            notified={notified}
            onNotify={handleNotify}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold md:text-2xl">{stream.title}</h1>
            {isLive && <span className="live-badge">Live</span>}
            {isEnded && (
              <span className="rounded-chip bg-bg-elevated-2 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                VOD
              </span>
            )}
            {isScheduled && (
              <span className="rounded-chip bg-accent-primary/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-accent-primary">
                Scheduled
              </span>
            )}
          </div>

          <CreatorIdentityCard creator={creator} compact />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <span>{statusLine}</span>
            {hasVideo && (
              <button type="button" onClick={() => setPanel("clip")} className="btn-secondary text-xs">
                Clip
              </button>
            )}
            <button type="button" onClick={() => setPanel("report")} className="btn-secondary text-xs">
              Report
            </button>
            <button
              type="button"
              onClick={() => {
                toggleStream(stream.id);
                addToast(followingStream ? "Removed from your follows" : "Following this stream");
              }}
              aria-pressed={followingStream}
              className="btn-secondary text-xs"
            >
              {followingStream ? "Following stream" : "Follow stream"}
            </button>
            {hasVideo && (
              <button
                type="button"
                onClick={() => setShortcutsOpen(true)}
                className="btn-secondary text-xs"
              >
                Shortcuts
              </button>
            )}
            <Link href="/settings#accessibility" className="btn-secondary text-xs">
              Accessibility
            </Link>
          </div>

          <PillNav items={contextPills} className="mt-4" />

          <p className="mt-4 text-sm text-text-secondary">{stream.description}</p>

          <button
            type="button"
            className="btn-secondary mt-4 lg:hidden"
            onClick={() => setChatOpen(true)}
          >
            Open chat
          </button>
        </div>

        <div className="hidden lg:block">
          <ChatPanel
            messages={allMessages}
            healthScore={healthScore}
            polls={polls}
            emotes={emotes}
            subscriberTier={subTier}
            onSend={isLive ? handleSend : undefined}
            onReportMessage={isLive ? () => setPanel("report") : undefined}
            readOnly={!isLive}
            readOnlyLabel={
              isEnded ? "Chat replay is closed for this VOD." : "Chat opens when the stream goes live."
            }
            emptyLabel={
              isEnded
                ? "This VOD's chat replay isn't available."
                : isScheduled
                  ? "Chat will open when the stream starts."
                  : "No messages in this tab yet."
            }
          />
        </div>
      </div>

      {isEnded && stream.chapters && stream.chapters.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Chapters</h2>
          <p className="mb-4 text-sm text-text-secondary">Jump to a moment in this replay.</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {stream.chapters.map((ch) => (
              <li key={ch.id}>
                <button
                  type="button"
                  onClick={() => seekTo(ch.atSecond)}
                  className="focus-ring flex w-full items-center justify-between gap-3 rounded-card border border-border-subtle bg-bg-elevated px-4 py-3 text-left transition-colors hover:border-border-strong"
                >
                  <span className="text-sm font-medium">{ch.title}</span>
                  <span className="rounded bg-bg-elevated-2 px-2 py-0.5 font-mono text-xs text-text-secondary">
                    {formatDuration(ch.atSecond)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {clips.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Clips from this stream</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clips.map((c) => (
              <Link
                key={c.id}
                href={`/clips/${c.id}`}
                className="group overflow-hidden rounded-card border border-border-subtle bg-bg-elevated transition-transform hover:-translate-y-0.5 hover:border-border-strong focus-ring"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.posterUrl}
                  alt={`Clip thumbnail: ${c.title}`}
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
                  width={320}
                  height={180}
                />
                <p className="p-3 text-sm font-medium">{c.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Related streams</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedStreams.slice(0, 3).map((s) => (
            <StreamCard key={s.id} stream={s} density="compact" />
          ))}
        </div>
      </section>

      <BloomLayer open={chatOpen} onClose={() => setChatOpen(false)} title="Chat">
        <ChatPanel
          messages={allMessages}
          healthScore={healthScore}
          polls={polls}
          emotes={emotes}
          subscriberTier={subTier}
          onSend={isLive ? handleSend : undefined}
          onReportMessage={isLive ? () => setPanel("report") : undefined}
          readOnly={!isLive}
          readOnlyLabel={
            isEnded ? "Chat replay is closed for this VOD." : "Chat opens when the stream goes live."
          }
        />
      </BloomLayer>

      <BloomLayer open={panel === "catch-up"} onClose={() => setPanel(null)} title={isEnded ? "Recap" : "Catch Me Up"}>
        <CatchMeUpPanel stream={stream} currentTime={currentTime} onSeek={hasVideo ? seekTo : undefined} />
      </BloomLayer>

      <BloomLayer open={panel === "clip"} onClose={() => setPanel(null)} title="Create clip">
        <ClipComposer stream={stream} currentTime={currentTime} onClose={() => setPanel(null)} />
      </BloomLayer>

      <BloomLayer open={panel === "subscribe"} onClose={() => setPanel(null)} title={`Subscribe to ${creator.displayName}`}>
        <SubscribeDialog creatorId={creator.id} creatorName={creator.displayName} onDone={() => setPanel(null)} />
      </BloomLayer>

      <BloomLayer open={panel === "rewards"} onClose={() => setPanel(null)} title="Channel points">
        <ChannelPointsPanel creatorId={creator.id} creatorName={creator.displayName} />
      </BloomLayer>

      <BloomLayer open={panel === "predict"} onClose={() => setPanel(null)} title="Predictions">
        <PredictionPanel stream={stream} />
      </BloomLayer>

      <BloomLayer open={panel === "report"} onClose={() => setPanel(null)} title="Report">
        <ReportDialog subjectType="stream" subjectId={stream.id} onClose={() => setPanel(null)} />
      </BloomLayer>

      <BloomLayer open={panel === "creator"} onClose={() => setPanel(null)} title="Creator">
        <CreatorIdentityCard creator={creator} />
        <Link href={`/channels/${creator.handle}`} className="btn-primary mt-4 inline-flex">
          View channel
        </Link>
      </BloomLayer>

      <BloomLayer open={panel === "filter"} onClose={() => setPanel(null)} title="Preferences & discovery">
        <WatchFilterPanel stream={stream} />
      </BloomLayer>

      <BloomLayer open={panel === "analytics"} onClose={() => setPanel(null)} title="Stream analytics">
        <WatchAnalyticsPanel stream={stream} viewerCount={viewerCount} healthScore={healthScore} />
      </BloomLayer>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BloomLayer } from "@/components/bloom/bloom-layer";
import { CatchMeUpPanel } from "@/components/chat/catch-me-up-panel";
import { ChatPanel } from "@/components/chat/chat-panel";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";
import { CinematicPlayer } from "@/components/stream/cinematic-player";
import { PillNav } from "@/components/shell/pill-nav";
import { StreamCard } from "@/components/stream/stream-card";
import {
  getCreatorById,
  getClipsByStreamId,
} from "@/lib/data";
import type { Stream } from "@/lib/types";
import {
  useChatSimulator,
  useHealthSimulator,
  useViewerPulse,
} from "@/lib/mock/simulators";
import { shouldShowJoinLate } from "@/lib/utils/catch-up";
import { formatViewerCount } from "@/lib/utils/format";
import type { ChatMessage } from "@/lib/types";

const ClipComposer = dynamic(
  () => import("@/components/stream/clip-composer").then((m) => m.ClipComposer),
  { ssr: false },
);
const ReportDialog = dynamic(
  () => import("@/components/stream/report-dialog").then((m) => m.ReportDialog),
  { ssr: false },
);
const KeyboardShortcuts = dynamic(
  () => import("@/components/stream/keyboard-shortcuts").then((m) => m.KeyboardShortcuts),
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

  const [currentTime, setCurrentTime] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  const viewerCount = useViewerPulse(stream.viewerCount, stream.state === "live");
  const simMessages = useChatSimulator(stream.id, stream.tags, stream.state === "live");
  const healthScore = useHealthSimulator(stream.health.chatHealthScore, stream.state === "live");

  const allMessages = [...simMessages, ...localMessages];

  const setPanel = useCallback(
    (p: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (p) params.set("panel", p);
      else params.delete("panel");
      router.push(`/live/${stream.slug}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, stream.slug],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") {
        setPanel(null);
        setShortcutsOpen(false);
      }
      if (e.key === "?") setShortcutsOpen(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setPanel]);

  const contextPills = [
    { key: "catch-up", label: "Catch Me Up", onClick: () => setPanel("catch-up") },
    { key: "clip", label: "Clip", onClick: () => setPanel("clip") },
    { key: "report", label: "Report", onClick: () => setPanel("report") },
    { key: "creator", label: "Creator", onClick: () => setPanel("creator") },
  ];

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
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold md:text-2xl">{stream.title}</h1>
            {stream.state === "live" && <span className="live-badge">Live</span>}
          </div>

          <CreatorIdentityCard creator={creator} compact />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <span>{formatViewerCount(viewerCount)} watching</span>
            <span>·</span>
            <span>Health {healthScore}/100</span>
            <button type="button" onClick={() => setPanel("clip")} className="btn-secondary text-xs">
              Clip
            </button>
            <button type="button" onClick={() => setPanel("report")} className="btn-secondary text-xs">
              Report
            </button>
            <button type="button" onClick={() => setShortcutsOpen(true)} className="btn-secondary text-xs">
              Shortcuts
            </button>
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
            onSend={(text) =>
              setLocalMessages((prev) => [
                ...prev,
                {
                  id: `local_${Date.now()}`,
                  streamId: stream.id,
                  authorId: "you",
                  authorName: "You",
                  authorRole: "viewer",
                  text,
                  sentAt: new Date().toISOString(),
                  sentiment: "neutral",
                  flags: { pinned: false, question: text.includes("?"), deleted: false, reported: false },
                },
              ])
            }
            onReportMessage={() => setPanel("report")}
          />
        </div>
      </div>

      {clips.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Clips from this stream</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clips.map((c) => (
              <Link
                key={c.id}
                href={`/clips/${c.id}`}
                className="solid-surface hover:border-accent-primary/30 focus-ring"
              >
                {c.title}
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
        <ChatPanel messages={allMessages} healthScore={healthScore} />
      </BloomLayer>

      <BloomLayer open={panel === "catch-up"} onClose={() => setPanel(null)} title="Catch Me Up">
        <CatchMeUpPanel stream={stream} currentTime={currentTime} />
      </BloomLayer>

      <BloomLayer open={panel === "clip"} onClose={() => setPanel(null)} title="Create clip">
        <ClipComposer stream={stream} currentTime={currentTime} onClose={() => setPanel(null)} />
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

      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

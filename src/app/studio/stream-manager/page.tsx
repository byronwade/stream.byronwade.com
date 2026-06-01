"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { CinematicPlayer } from "@/components/stream/cinematic-player";
import { getFeaturedStream } from "@/lib/data";
import { useChatSimulator, useViewerPulse } from "@/lib/mock/simulators";

export default function StreamManagerPage() {
  const stream = getFeaturedStream();
  const viewers = useViewerPulse(stream.viewerCount, true);
  const messages = useChatSimulator(stream.id, stream.tags, true);

  return (
    <div className="section-shell py-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="live-badge">Live</span>
        <span className="text-sm text-text-secondary">{viewers} viewers</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <CinematicPlayer stream={stream} />
          <div className="mt-4 solid-surface">
            <h3 className="font-semibold">Scene notes</h3>
            <textarea className="input-field mt-2 min-h-[80px]" placeholder="Notes for this segment..." />
          </div>
        </div>
        <div className="min-h-[400px]">
          <ChatPanel messages={messages} healthScore={stream.health.chatHealthScore} />
        </div>
      </div>

      <div className="mt-6 solid-surface">
        <h3 className="font-semibold">Activity feed</h3>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary">
          <li>New follower: PixelPioneer</li>
          <li>Clip created: Bridge complete moment</li>
          <li>Poll ended: Glass roofs win 62%</li>
        </ul>
      </div>
    </div>
  );
}

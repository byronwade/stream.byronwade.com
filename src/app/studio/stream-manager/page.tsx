"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { CinematicPlayer } from "@/components/stream/cinematic-player";
import { getFeaturedStream, getPollsByStreamId } from "@/lib/data";
import { useActivityFeed, useChatSimulator, useViewerPulse } from "@/lib/mock/simulators";
import { useStudioSettings } from "@/lib/stores/settings";

export default function StreamManagerPage() {
  const stream = getFeaturedStream();
  const viewers = useViewerPulse(stream.viewerCount, true);
  const messages = useChatSimulator(stream.id, stream.tags, true);
  const polls = getPollsByStreamId(stream.id);
  const activity = useActivityFeed(true);
  const { sceneNotes, updateSettings } = useStudioSettings();

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
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Scene notes</h3>
              <span className="text-xs text-text-tertiary">Saved automatically</span>
            </div>
            <textarea
              value={sceneNotes}
              onChange={(e) => updateSettings({ sceneNotes: e.target.value })}
              className="input-field mt-2 min-h-[80px]"
              placeholder="Notes for this segment — persist across reloads in this browser..."
              aria-label="Scene notes"
            />
          </div>
        </div>
        <div className="min-h-[400px]">
          <ChatPanel messages={messages} healthScore={stream.health.chatHealthScore} polls={polls} />
        </div>
      </div>

      <div className="mt-6 solid-surface">
        <h3 className="font-semibold">Activity feed</h3>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary" aria-live="polite">
          {activity.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <span aria-hidden className="text-accent-primary">
                •
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

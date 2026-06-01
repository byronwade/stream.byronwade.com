"use client";

import { DashboardGrid } from "@/components/studio/dashboard-grid";
import { ModerationQueue } from "@/components/studio/moderation-queue";
import { ChatPanel } from "@/components/chat/chat-panel";
import { CinematicPlayer } from "@/components/stream/cinematic-player";
import { getFeaturedStream } from "@/lib/data";
import { useChatSimulator } from "@/lib/mock/simulators";
import { useLayoutPrefs } from "@/lib/stores/layout";

export default function StudioModerationPage() {
  const stream = getFeaturedStream();
  const messages = useChatSimulator(stream.id, stream.tags, true);
  const { resetModerationLayout } = useLayoutPrefs();

  const widgets = [
    {
      id: "preview",
      title: "Stream preview",
      content: <CinematicPlayer stream={stream} mutedByDefault />,
    },
    {
      id: "chat",
      title: "Live chat",
      content: (
        <div className="min-h-[300px]">
          <ChatPanel messages={messages} healthScore={stream.health.chatHealthScore} />
        </div>
      ),
    },
    {
      id: "queue",
      title: "Moderation queue",
      content: <ModerationQueue />,
    },
    {
      id: "actions",
      title: "Quick actions",
      content: (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary text-xs">Slow mode</button>
          <button type="button" className="btn-secondary text-xs">Followers only</button>
          <button type="button" className="btn-secondary text-xs">Clear chat</button>
        </div>
      ),
    },
    {
      id: "blocked-terms",
      title: "Blocked terms",
      content: <p className="text-sm text-text-secondary">Manage in queue panel above.</p>,
    },
  ];

  return (
    <div className="section-shell py-8">
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-bold">Moderation</h2>
        <button type="button" onClick={resetModerationLayout} className="btn-secondary text-xs">
          Reset layout
        </button>
      </div>
      <DashboardGrid widgets={widgets} />
    </div>
  );
}

"use client";

import { DashboardGrid } from "@/components/studio/dashboard-grid";
import { ModerationQueue } from "@/components/studio/moderation-queue";
import { ChatPanel } from "@/components/chat/chat-panel";
import { CinematicPlayer } from "@/components/stream/cinematic-player";
import { getFeaturedStream } from "@/lib/data";
import { useChatSimulator } from "@/lib/mock/simulators";
import { useLayoutPrefs } from "@/lib/stores/layout";
import { useReports } from "@/lib/stores/report";
import { useUIStore } from "@/lib/stores/ui";
import { cn } from "@/lib/utils/cn";

export default function StudioModerationPage() {
  const stream = getFeaturedStream();
  const messages = useChatSimulator(stream.id, stream.tags, true);
  const { resetModerationLayout } = useLayoutPrefs();
  const { chatControls, blockedTerms, toggleSlowMode, toggleFollowersOnly, clearChat } = useReports();
  const { addToast } = useUIStore();

  const clearedAt = chatControls.clearedAt ? new Date(chatControls.clearedAt).getTime() : 0;
  const visibleMessages = clearedAt
    ? messages.filter((m) => new Date(m.sentAt).getTime() >= clearedAt)
    : messages;

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
          <ChatPanel
            messages={visibleMessages}
            healthScore={stream.health.chatHealthScore}
            readOnly
            readOnlyLabel={
              chatControls.slowMode || chatControls.followersOnly
                ? `Restrictions active: ${[
                    chatControls.slowMode && "slow mode",
                    chatControls.followersOnly && "followers-only",
                  ]
                    .filter(Boolean)
                    .join(", ")}`
                : "Moderator preview — viewer composer hidden."
            }
          />
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
          <button
            type="button"
            onClick={() => {
              toggleSlowMode();
              addToast(chatControls.slowMode ? "Slow mode disabled" : "Slow mode enabled (30s)");
            }}
            aria-pressed={chatControls.slowMode}
            className={cn("btn-secondary text-xs", chatControls.slowMode && "border-accent-primary/40 bg-accent-primary/10 text-accent-primary")}
          >
            Slow mode {chatControls.slowMode ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleFollowersOnly();
              addToast(chatControls.followersOnly ? "Followers-only disabled" : "Followers-only enabled");
            }}
            aria-pressed={chatControls.followersOnly}
            className={cn("btn-secondary text-xs", chatControls.followersOnly && "border-accent-primary/40 bg-accent-primary/10 text-accent-primary")}
          >
            Followers only {chatControls.followersOnly ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => {
              clearChat();
              addToast("Chat cleared");
            }}
            className="btn-secondary text-xs"
          >
            Clear chat
          </button>
        </div>
      ),
    },
    {
      id: "blocked-terms",
      title: "Blocked terms",
      content: (
        <p className="text-sm text-text-secondary">
          {blockedTerms.length > 0
            ? `${blockedTerms.length} term${blockedTerms.length > 1 ? "s" : ""} masked in live chat. Manage them in the queue panel above.`
            : "No blocked terms yet. Add them in the queue panel above to mask matching words in chat."}
        </p>
      ),
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

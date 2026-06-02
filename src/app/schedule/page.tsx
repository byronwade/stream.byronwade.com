import { getAllCreators, getScheduledStreams, getCreatorById } from "@/lib/data";
import { ScheduleClient, type ScheduleEvent } from "./schedule-client";

export const metadata = { title: "Schedule" };

export default function SchedulePage() {
  const scheduled = getScheduledStreams();
  const allSchedules = getAllCreators().flatMap((c) =>
    c.schedule.map((s) => ({ ...s, creator: c })),
  );

  const events: ScheduleEvent[] = [
    ...scheduled.map((s) => ({
      id: s.id,
      kind: "stream" as const,
      title: s.title,
      startsAt: s.scheduledFor!,
      creatorName: getCreatorById(s.creatorId)?.displayName ?? "",
      href: `/live/${s.slug}`,
    })),
    ...allSchedules.map((s) => ({
      id: s.id,
      kind: "schedule" as const,
      title: s.title,
      startsAt: s.startsAt,
      creatorName: s.creator.displayName,
      href: `/channels/${s.creator.handle}?tab=schedule`,
    })),
  ].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Schedule</h1>
      <p className="mt-1 text-text-secondary">Upcoming streams and events.</p>
      <ScheduleClient events={events} />
    </div>
  );
}

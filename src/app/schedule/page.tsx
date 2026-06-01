import { getAllCreators, getScheduledStreams, getCreatorById } from "@/lib/data";

export const metadata = { title: "Schedule" };

export default function SchedulePage() {
  const scheduled = getScheduledStreams();
  const allSchedules = getAllCreators().flatMap((c) =>
    c.schedule.map((s) => ({ ...s, creator: c })),
  );

  const events = [
    ...scheduled.map((s) => ({
      id: s.id,
      title: s.title,
      startsAt: s.scheduledFor!,
      creator: getCreatorById(s.creatorId)!,
      href: `/live/${s.slug}`,
    })),
    ...allSchedules.map((s) => ({
      id: s.id,
      title: s.title,
      startsAt: s.startsAt,
      creator: s.creator,
      href: `/channels/${s.creator.handle}?tab=schedule`,
    })),
  ].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Schedule</h1>
      <p className="mt-1 text-text-secondary">Upcoming streams and events.</p>

      <div className="mt-6 flex gap-2">
        <span className="pill-nav-active text-xs">List</span>
        <span className="pill-nav text-xs opacity-60">Calendar</span>
      </div>

      <ul className="mt-8 space-y-4">
        {events.map((e) => (
          <li key={e.id} className="solid-surface flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-text-secondary">{e.creator.displayName}</p>
              <p className="text-xs text-text-tertiary">
                {new Date(e.startsAt).toLocaleString()}
              </p>
            </div>
            <button type="button" className="btn-secondary text-sm">
              Set reminder
            </button>
          </li>
        ))}
      </ul>

      {events.length === 0 && (
        <p className="mt-8 text-text-secondary">No upcoming events.</p>
      )}
    </div>
  );
}

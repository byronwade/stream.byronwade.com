import Link from "next/link";
import { MoodRail } from "@/components/stream/mood-rail";
import { StreamCard } from "@/components/stream/stream-card";
import { ReminderButton } from "@/components/stream/reminder-button";
import { ContinueWatchingRail } from "@/components/stream/continue-watching-rail";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";
import {
  getFeaturedStream,
  getLiveStreams,
  getScheduledStreams,
  getAllClips,
  getRisingCreators,
  getCreatorById,
} from "@/lib/data";
import { formatViewerCount } from "@/lib/utils/format";

export default function HomePage() {
  const featured = getFeaturedStream();
  const featuredCreator = getCreatorById(featured.creatorId)!;
  const live = getLiveStreams().filter((s) => s.id !== featured.id);
  const scheduled = getScheduledStreams();
  const clips = getAllClips().slice(0, 4);
  const rising = getRisingCreators(4);

  return (
    <div className="pb-8">
      <section className="section-shell py-8">
        <div className="overflow-hidden rounded-panel border border-border-subtle bg-bg-elevated">
          <div className="grid md:grid-cols-2">
            <div className="video-stage md:rounded-none md:rounded-l-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.posterUrl}
                alt={`${featured.title} — featured live stream`}
                className="aspect-video w-full object-cover"
                width={1280}
                height={720}
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              <span className="live-badge mb-3 w-fit">Featured Live</span>
              <h1 className="text-2xl font-bold md:text-3xl">{featured.title}</h1>
              <p className="mt-2 text-text-secondary">{featuredCreator.displayName}</p>
              <p className="mt-2 text-sm text-text-secondary line-clamp-2">{featured.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-text-tertiary">
                <span>{formatViewerCount(featured.viewerCount)} watching</span>
                <span>·</span>
                <span>Health {featured.health.chatHealthScore}/100</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/live/${featured.slug}?panel=catch-up`} className="btn-secondary">
                  Join Late
                </Link>
                <Link href={`/live/${featured.slug}`} className="btn-primary">
                  Watch Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContinueWatchingRail className="section-shell mb-12" />

      <section className="section-shell mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Discover by mood
        </h2>
        <MoodRail linkMode />
      </section>

      <section className="section-shell mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live Now</h2>
          <Link href="/discover" className="text-sm text-accent-primary hover:underline">
            See all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {live.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      <section className="section-shell mb-12">
        <h2 className="mb-4 text-lg font-semibold">Rising Creators</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {rising.map((creator) => (
            <div key={creator.id} className="solid-surface">
              <CreatorIdentityCard creator={creator} />
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Popular Clips</h2>
          <Link href="/clips" className="text-sm text-accent-primary hover:underline">
            Browse clips
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clips.map((clip) => (
            <Link
              key={clip.id}
              href={`/clips/${clip.id}`}
              className="overflow-hidden rounded-card border border-border-subtle bg-bg-elevated hover:border-border-strong focus-ring"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={clip.posterUrl} alt={`Clip thumbnail: ${clip.title}`} className="aspect-video w-full object-cover" width={320} height={180} />
              <p className="p-3 text-sm font-medium">{clip.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {scheduled.length > 0 && (
        <section className="section-shell">
          <h2 className="mb-4 text-lg font-semibold">Upcoming</h2>
          <div className="space-y-3">
            {scheduled.map((s) => {
              const c = getCreatorById(s.creatorId);
              return (
                <div key={s.id} className="solid-surface flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link href={`/live/${s.slug}`} className="font-medium hover:text-accent-primary focus-ring">
                      {s.title}
                    </Link>
                    <p className="text-sm text-text-secondary">{c?.displayName}</p>
                  </div>
                  <ReminderButton
                    id={s.id}
                    kind="stream"
                    title={s.title}
                    startsAt={s.scheduledFor}
                    creatorName={c?.displayName}
                    idleLabel="Remind me"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

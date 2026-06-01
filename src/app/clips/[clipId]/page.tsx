import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllClipIds, getClipById, getStreamById, getCreatorById } from "@/lib/data";
import { formatDuration } from "@/lib/utils/format";

export function generateStaticParams() {
  return getAllClipIds().map((clipId) => ({ clipId }));
}

interface PageProps {
  params: Promise<{ clipId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { clipId } = await params;
  const clip = getClipById(clipId);
  return { title: clip?.title ?? "Clip" };
}

export default async function ClipPage({ params }: PageProps) {
  const { clipId } = await params;
  const clip = getClipById(clipId);
  if (!clip) notFound();

  const stream = getStreamById(clip.streamId);
  const creator = getCreatorById(clip.creatorId);

  return (
    <div className="section-shell py-8">
      <div className="mx-auto max-w-4xl">
        <div className="video-stage">
          <video
            src={clip.mp4Url}
            poster={clip.posterUrl}
            controls
            className="aspect-video w-full bg-black"
            aria-label={clip.title}
          />
        </div>

        <h1 className="mt-6 text-2xl font-bold">{clip.title}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {formatDuration(clip.durationSeconds)} · {clip.views.toLocaleString()} views ·{" "}
          {clip.likes.toLocaleString()} likes
        </p>

        {creator && (
          <p className="mt-2">
            by{" "}
            <Link href={`/channels/${creator.handle}`} className="text-accent-primary hover:underline">
              {creator.displayName}
            </Link>
          </p>
        )}

        {stream && (
          <Link
            href={`/live/${stream.slug}`}
            className="btn-primary mt-6 inline-flex"
          >
            Watch source stream
          </Link>
        )}
      </div>
    </div>
  );
}

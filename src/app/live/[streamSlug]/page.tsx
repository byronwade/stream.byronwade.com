import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getAllStreamSlugs,
  getCreatorById,
  getLiveStreams,
  getStreamBySlug,
} from "@/lib/data";
import { JsonLd } from "@/components/seo/json-ld";
import { WatchPageClient } from "./watch-client";

const SITE = "https://stream.byronwade.com";

export function generateStaticParams() {
  return getAllStreamSlugs().map((streamSlug) => ({ streamSlug }));
}

interface PageProps {
  params: Promise<{ streamSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { streamSlug } = await params;
  const stream = getStreamBySlug(streamSlug);
  if (!stream) return { title: "Stream" };
  const url = `${SITE}/live/${stream.slug}`;
  const image = `/og/${stream.slug}.svg`;
  return {
    title: stream.title,
    description: stream.description,
    alternates: { canonical: url },
    openGraph: {
      type: "video.other",
      title: stream.title,
      description: stream.description,
      url,
      images: [{ url: image, width: 1200, height: 630, type: "image/svg+xml" }],
    },
    twitter: {
      card: "summary_large_image",
      title: stream.title,
      description: stream.description,
      images: [image],
    },
  };
}

export default async function LivePage({ params }: PageProps) {
  const { streamSlug } = await params;
  const stream = getStreamBySlug(streamSlug);
  if (!stream) notFound();

  const related = getLiveStreams().filter((s) => s.id !== stream.id);
  const creator = getCreatorById(stream.creatorId);
  const isLive = stream.state === "live" || stream.state === "warmup";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: stream.title,
    description: stream.description,
    thumbnailUrl: [`${SITE}${stream.posterUrl}`, `${SITE}${stream.thumbnailUrl}`],
    uploadDate: stream.startedAt ?? stream.scheduledFor ?? undefined,
    contentUrl: `${SITE}${stream.videoUrl}`,
    embedUrl: `${SITE}/live/${stream.slug}`,
    duration: `PT${Math.max(1, Math.round(stream.durationSeconds))}S`,
    genre: stream.categorySlug,
    inLanguage: stream.language,
    ...(creator
      ? { author: { "@type": "Person", name: creator.displayName, url: `${SITE}/channels/${creator.handle}` } }
      : {}),
    ...(isLive
      ? {
          publication: {
            "@type": "BroadcastEvent",
            isLiveBroadcast: true,
            startDate: stream.startedAt ?? undefined,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Suspense fallback={<div className="section-shell py-12">Loading...</div>}>
        <WatchPageClient stream={stream} relatedStreams={related} />
      </Suspense>
    </>
  );
}

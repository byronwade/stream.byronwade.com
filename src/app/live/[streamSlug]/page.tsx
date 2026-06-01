import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getAllStreamSlugs,
  getLiveStreams,
  getStreamBySlug,
} from "@/lib/data";
import { WatchPageClient } from "./watch-client";

export function generateStaticParams() {
  return getAllStreamSlugs().map((streamSlug) => ({ streamSlug }));
}

interface PageProps {
  params: Promise<{ streamSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { streamSlug } = await params;
  const stream = getStreamBySlug(streamSlug);
  return { title: stream?.title ?? "Stream" };
}

export default async function LivePage({ params }: PageProps) {
  const { streamSlug } = await params;
  const stream = getStreamBySlug(streamSlug);
  if (!stream) notFound();

  const related = getLiveStreams().filter((s) => s.id !== stream.id);

  return (
    <Suspense fallback={<div className="section-shell py-12">Loading...</div>}>
      <WatchPageClient stream={stream} relatedStreams={related} />
    </Suspense>
  );
}

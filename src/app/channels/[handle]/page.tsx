import { notFound } from "next/navigation";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";
import {
  getAllCreatorHandles,
  getCreatorByHandle,
  getStreamsByCreatorId,
  getClipsByCreatorId,
} from "@/lib/data";
import { ChannelClient } from "./channel-client";

export function generateStaticParams() {
  return getAllCreatorHandles().map((handle) => ({ handle }));
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const creator = getCreatorByHandle(handle);
  return { title: creator?.displayName ?? "Channel" };
}

export default async function ChannelPage({ params }: PageProps) {
  const { handle } = await params;
  const creator = getCreatorByHandle(handle);
  if (!creator) notFound();

  const streams = getStreamsByCreatorId(creator.id);
  const clips = getClipsByCreatorId(creator.id);

  return (
    <div>
      <div className="relative h-40 overflow-hidden bg-bg-elevated md:h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={creator.bannerUrl} alt="" className="h-full w-full object-cover opacity-60" />
      </div>

      <div className="section-shell relative -mt-12 pb-12">
        <div className="solid-surface mb-6">
          <CreatorIdentityCard creator={creator} />
        </div>

        <ChannelClient creator={creator} streams={streams} clips={clips} />
      </div>
    </div>
  );
}

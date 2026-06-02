import { notFound } from "next/navigation";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";
import {
  getAllCreatorHandles,
  getCreatorByHandle,
  getStreamsByCreatorId,
  getClipsByCreatorId,
} from "@/lib/data";
import { JsonLd } from "@/components/seo/json-ld";
import { ChannelClient } from "./channel-client";

const SITE = "https://stream.byronwade.com";

export function generateStaticParams() {
  return getAllCreatorHandles().map((handle) => ({ handle }));
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const creator = getCreatorByHandle(handle);
  if (!creator) return { title: "Channel" };
  const url = `${SITE}/channels/${creator.handle}`;
  const image = `/og/channel-${creator.handle}.svg`;
  return {
    title: creator.displayName,
    description: creator.bio,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title: `${creator.displayName} on Stream`,
      description: creator.bio,
      url,
      images: [{ url: image, width: 1200, height: 630, type: "image/svg+xml" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${creator.displayName} on Stream`,
      description: creator.bio,
      images: [image],
    },
  };
}

export default async function ChannelPage({ params }: PageProps) {
  const { handle } = await params;
  const creator = getCreatorByHandle(handle);
  if (!creator) notFound();

  const streams = getStreamsByCreatorId(creator.id);
  const clips = getClipsByCreatorId(creator.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: creator.displayName,
      alternateName: `@${creator.handle}`,
      description: creator.bio,
      image: `${SITE}${creator.avatarUrl}`,
      url: `${SITE}/channels/${creator.handle}`,
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/FollowAction",
        userInteractionCount: creator.followerCount,
      },
    },
  };

  return (
    <div>
      <JsonLd data={jsonLd} />
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

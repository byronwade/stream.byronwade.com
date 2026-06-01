"use client";

import Link from "next/link";
import { useFollows } from "@/lib/stores/follow";
import { getLiveStreams, getCreatorById } from "@/lib/data";
import { StreamCard } from "@/components/stream/stream-card";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";

export default function FollowingPage() {
  const { creators: followedIds } = useFollows();
  const followedCreators = followedIds
    .map((id) => getCreatorById(id))
    .filter(Boolean);
  const liveFollowed = getLiveStreams().filter((s) => followedIds.includes(s.creatorId));
  const offline = followedCreators.filter((c) => !c!.liveStreamId);

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Following</h1>

      {followedCreators.length === 0 ? (
        <div className="mt-8 solid-surface text-center">
          <p className="text-text-secondary">You are not following anyone yet.</p>
          <Link href="/discover" className="btn-primary mt-4 inline-flex">
            Discover streams
          </Link>
        </div>
      ) : (
        <>
          {liveFollowed.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">Live now</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {liveFollowed.map((s) => (
                  <StreamCard key={s.id} stream={s} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-12">
            <h2 className="mb-4 text-lg font-semibold">Offline</h2>
            <div className="space-y-4">
              {offline.map((c) => c && (
                <div key={c.id} className="solid-surface">
                  <CreatorIdentityCard creator={c} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

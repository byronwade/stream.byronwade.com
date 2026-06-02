import { notFound } from "next/navigation";
import Link from "next/link";
import { StreamCard } from "@/components/stream/stream-card";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";
import { CategoryFollowButton } from "@/components/stream/category-follow-button";
import { formatDuration } from "@/lib/utils/format";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
  getStreamsByCategory,
  getCreatorById,
  getAllClips,
} from "@/lib/data";

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const streams = getStreamsByCategory(slug);
  const liveStreams = streams.filter((s) => s.state === "live");
  const featured = category.featuredCreatorIds
    .map((id) => getCreatorById(id))
    .filter(Boolean);
  const clips = getAllClips().filter((c) =>
    streams.some((s) => s.id === c.streamId),
  );

  return (
    <div className="section-shell py-8">
      <div className="mb-8 overflow-hidden rounded-panel border border-border-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.heroImage}
          alt={`${category.name} category banner`}
          className="h-48 w-full object-cover md:h-64"
        />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="mt-2 text-text-secondary">{category.description}</p>
            </div>
            <CategoryFollowButton slug={category.slug} name={category.name} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {category.topTags.map((tag) => (
              <span key={tag} className="pill-nav text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Top creators</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((c) => c && (
              <div key={c.id} className="solid-surface">
                <CreatorIdentityCard creator={c} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Live now</h2>
        {liveStreams.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveStreams.map((s) => (
              <StreamCard key={s.id} stream={s} />
            ))}
          </div>
        ) : (
          <p className="solid-surface text-sm text-text-secondary">
            No one is live in {category.name} right now. Check the schedule or follow the category to
            get mock reminders.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Clips</h2>
        {clips.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clips.map((c) => (
              <Link
                key={c.id}
                href={`/clips/${c.id}`}
                className="group overflow-hidden rounded-card border border-border-subtle bg-bg-elevated hover:border-border-strong focus-ring"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.posterUrl}
                  alt={`Clip thumbnail: ${c.title}`}
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
                  width={320}
                  height={180}
                />
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">{c.title}</p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {formatDuration(c.durationSeconds)} · {c.views.toLocaleString()} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="solid-surface text-sm text-text-secondary">
            No clips from {category.name} yet — create one from any live stream.
          </p>
        )}
      </section>
    </div>
  );
}

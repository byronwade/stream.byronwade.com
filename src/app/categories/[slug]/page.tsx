import { notFound } from "next/navigation";
import Link from "next/link";
import { StreamCard } from "@/components/stream/stream-card";
import { CreatorIdentityCard } from "@/components/creator/creator-identity-card";
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
        <img src={category.heroImage} alt="" className="h-48 w-full object-cover md:h-64" />
        <div className="p-6">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="mt-2 text-text-secondary">{category.description}</p>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {streams.filter((s) => s.state === "live").map((s) => (
            <StreamCard key={s.id} stream={s} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Clips</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clips.map((c) => (
            <Link key={c.id} href={`/clips/${c.id}`} className="solid-surface focus-ring">
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { MetadataRoute } from "next";
import {
  getAllStreams,
  getAllCreators,
  getAllCategorySlugs,
  getAllClipIds,
} from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://stream.byronwade.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/discover`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/clips`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/squad`, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/schedule`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/help`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/following`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/settings`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/messages`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${base}/library/clips`, changeFrequency: "weekly", priority: 0.3 },
  ];

  const studioRoutes: MetadataRoute.Sitemap = [
    "/studio",
    "/studio/go-live",
    "/studio/stream-manager",
    "/studio/analytics",
    "/studio/clips",
    "/studio/community",
    "/studio/moderation",
    "/studio/monetization",
    "/studio/alerts",
    "/studio/restream",
    "/studio/settings",
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: 0.3 }));

  const authRoutes: MetadataRoute.Sitemap = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/pin",
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly", priority: 0.2 }));

  const streamRoutes: MetadataRoute.Sitemap = getAllStreams().map((s) => ({
    url: `${base}/live/${s.slug}`,
    changeFrequency: s.state === "live" ? "hourly" : "daily",
    priority: 0.8,
  }));

  const channelRoutes: MetadataRoute.Sitemap = getAllCreators().map((c) => ({
    url: `${base}/channels/${c.handle}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategorySlugs().map((slug) => ({
    url: `${base}/categories/${slug}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const clipRoutes: MetadataRoute.Sitemap = getAllClipIds().map((id) => ({
    url: `${base}/clips/${id}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...studioRoutes,
    ...authRoutes,
    ...streamRoutes,
    ...channelRoutes,
    ...categoryRoutes,
    ...clipRoutes,
  ];
}

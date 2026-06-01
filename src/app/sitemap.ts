import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://stream.byronwade.com";

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/discover`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/clips`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/schedule`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/live/forest-city-build`, changeFrequency: "hourly", priority: 0.9 },
  ];
}

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stream — Live Platform Concept",
    short_name: "Stream",
    description:
      "A frontend-only streaming platform concept with mocked discovery, watch, clips, and creator studio flows.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070a12",
    theme_color: "#070a12",
    categories: ["entertainment", "social"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}

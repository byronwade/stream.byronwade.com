import { getAllClips } from "@/lib/data";
import { ClipsClient } from "./clips-client";

export const metadata = { title: "Clips" };

export default function ClipsPage() {
  const clips = getAllClips();

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Clips</h1>
      <p className="mt-1 text-text-secondary">Highlights from live streams across Stream.</p>
      <ClipsClient clips={clips} />
    </div>
  );
}

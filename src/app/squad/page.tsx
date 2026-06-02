import type { Metadata } from "next";
import { SquadClient } from "./squad-client";

export const metadata: Metadata = {
  title: "Squad",
  description: "Watch up to four live streams at once in a multi-view grid.",
};

export default function SquadPage() {
  return <SquadClient />;
}

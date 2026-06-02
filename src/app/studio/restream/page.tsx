import type { Metadata } from "next";
import { RestreamClient } from "./restream-client";

export const metadata: Metadata = { title: "Restream" };

export default function RestreamPage() {
  return <RestreamClient />;
}

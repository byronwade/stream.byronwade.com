import type { Metadata } from "next";
import { AlertsClient } from "./alerts-client";

export const metadata: Metadata = { title: "Alerts & Overlays" };

export default function AlertsPage() {
  return <AlertsClient />;
}

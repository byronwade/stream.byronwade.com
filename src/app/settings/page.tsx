import type { Metadata } from "next";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Stream account, playback defaults, notifications, and accessibility.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}

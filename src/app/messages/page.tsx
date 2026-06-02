import type { Metadata } from "next";
import { MessagesClient } from "./messages-client";

export const metadata: Metadata = {
  title: "Messages",
  description: "Mock whispers and direct messages with creators.",
};

export default function MessagesPage() {
  return <MessagesClient />;
}

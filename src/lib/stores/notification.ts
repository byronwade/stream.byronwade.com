"use client";

import { useSyncExternalStore } from "react";
import type { NotificationItem } from "@/lib/types";
import notificationsSeed from "@/data/notifications.json";
import { createStore } from "./base";

const seed = notificationsSeed as NotificationItem[];

const notificationStore = createStore<NotificationItem[]>("stream:v1:notifications", seed);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:notifications") notificationStore.hydrate();
  });
}

/** Module-level push so simulators can append without a hook instance. */
export function pushNotification(item: Omit<NotificationItem, "id" | "createdAt" | "read">) {
  notificationStore.setState((prev) =>
    [
      {
        ...item,
        id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ].slice(0, 40),
  );
}

export function useNotifications() {
  const notifications = useSyncExternalStore(
    notificationStore.subscribe,
    notificationStore.getSnapshot,
    () => seed,
  );

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    push: pushNotification,
    markRead: (id: string) => {
      notificationStore.setState((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    markAllRead: () => {
      notificationStore.setState((prev) => prev.map((n) => ({ ...n, read: true })));
    },
    clearAll: () => notificationStore.setState([]),
  };
}

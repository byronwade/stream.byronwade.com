"use client";

import { useSyncExternalStore } from "react";
import type { Reminder } from "@/lib/types";
import { createStore } from "./base";

const reminderStore = createStore<Reminder[]>("stream:v1:reminders", []);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:reminders") reminderStore.hydrate();
  });
}

function keyFor(reminder: Pick<Reminder, "streamId" | "scheduleId">) {
  return reminder.streamId ?? reminder.scheduleId ?? "";
}

export function useReminders() {
  const reminders = useSyncExternalStore(reminderStore.subscribe, reminderStore.getSnapshot, () => []);

  const hasReminder = (id: string) =>
    reminders.some((r) => r.streamId === id || r.scheduleId === id);

  return {
    reminders,
    hasReminder,
    /** Toggle a reminder on/off. Returns true if it is now set, false if it was removed. */
    toggleReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => {
      const id = keyFor(reminder);
      const existing = reminders.some((r) => keyFor(r) === id);
      if (existing) {
        reminderStore.setState((prev) => prev.filter((r) => keyFor(r) !== id));
        return false;
      }
      reminderStore.setState((prev) => [
        { ...reminder, id: `reminder_${Date.now()}`, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      return true;
    },
    removeReminder: (id: string) => {
      reminderStore.setState((prev) => prev.filter((r) => r.id !== id));
    },
  };
}

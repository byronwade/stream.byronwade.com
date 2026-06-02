"use client";

import { useReminders } from "@/lib/stores/reminder";
import { useUIStore } from "@/lib/stores/ui";
import { cn } from "@/lib/utils/cn";

interface ReminderButtonProps {
  id: string;
  kind: "stream" | "schedule";
  title: string;
  startsAt: string | null;
  creatorName?: string;
  className?: string;
  idleLabel?: string;
  setLabel?: string;
}

/** Toggles a localStorage-backed reminder for a scheduled stream or schedule entry. */
export function ReminderButton({
  id,
  kind,
  title,
  startsAt,
  creatorName,
  className,
  idleLabel = "Set reminder",
  setLabel = "Reminder set ✓",
}: ReminderButtonProps) {
  const { hasReminder, toggleReminder } = useReminders();
  const { addToast } = useUIStore();
  const active = hasReminder(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        const set = toggleReminder({
          ...(kind === "stream" ? { streamId: id } : { scheduleId: id }),
          title,
          startsAt,
          creatorName,
        });
        addToast(set ? `Reminder set for "${title}"` : `Reminder removed for "${title}"`);
      }}
      className={cn(
        "btn-secondary text-sm",
        active && "border-accent-primary/40 bg-accent-primary/10 text-accent-primary",
        className,
      )}
    >
      {active ? setLabel : idleLabel}
    </button>
  );
}

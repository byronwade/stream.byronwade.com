"use client";

import { cn } from "@/lib/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  id?: string;
}

/** Accessible switch with an on-brand track. Solid surfaces (settings/studio). */
export function Toggle({ checked, onChange, label, description, id }: ToggleProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 py-2">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-text-primary">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-text-secondary">{description}</span>}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "focus-ring relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-accent-primary" : "bg-bg-elevated-2 border border-border-strong",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </label>
  );
}

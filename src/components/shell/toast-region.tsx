"use client";

import { useUIStore } from "@/lib/stores/ui";
import { cn } from "@/lib/utils/cn";

export function ToastRegion() {
  const { toasts, dismissToast } = useUIStore();

  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-[100] flex flex-col gap-2 md:bottom-6"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto glass-card px-4 py-3 text-sm shadow-panel",
            toast.type === "success" && "border-success/30",
            toast.type === "error" && "border-danger/30",
          )}
          role="status"
        >
          <div className="flex items-center gap-3">
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-text-tertiary hover:text-text-primary focus-ring rounded"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

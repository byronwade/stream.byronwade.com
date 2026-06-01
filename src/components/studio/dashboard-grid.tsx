"use client";

import { useLayoutPrefs } from "@/lib/stores/layout";
import { cn } from "@/lib/utils/cn";

interface Widget {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface DashboardGridProps {
  widgets: Widget[];
}

export function DashboardGrid({ widgets }: DashboardGridProps) {
  const { moderation, setModerationLayout } = useLayoutPrefs();
  const order = moderation.widgetOrder.filter((id) => !moderation.hiddenWidgets.includes(id));
  const widgetMap = Object.fromEntries(widgets.map((w) => [w.id, w]));

  const moveWidget = (id: string, direction: -1 | 1) => {
    const idx = order.indexOf(id);
    if (idx < 0) return;
    const newOrder = [...order];
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= newOrder.length) return;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    setModerationLayout({ widgetOrder: newOrder });
  };

  const toggleHidden = (id: string) => {
    const hidden = moderation.hiddenWidgets.includes(id)
      ? moderation.hiddenWidgets.filter((w) => w !== id)
      : [...moderation.hiddenWidgets, id];
    setModerationLayout({ hiddenWidgets: hidden });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {widgets.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => toggleHidden(w.id)}
            className={cn(
              "pill-nav text-xs",
              moderation.hiddenWidgets.includes(w.id) && "opacity-50",
            )}
          >
            {moderation.hiddenWidgets.includes(w.id) ? "Show" : "Hide"} {w.title}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {order.map((id) => {
          const widget = widgetMap[id];
          if (!widget) return null;
          const size = moderation.widgetSizes[id];
          return (
            <div
              key={id}
              className={cn(
                "solid-surface",
                size && size.w >= 12 && "md:col-span-2 xl:col-span-3",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{widget.title}</h3>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveWidget(id, -1)} className="btn-secondary px-2 py-1 text-xs">
                    ↑
                  </button>
                  <button type="button" onClick={() => moveWidget(id, 1)} className="btn-secondary px-2 py-1 text-xs">
                    ↓
                  </button>
                </div>
              </div>
              {widget.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

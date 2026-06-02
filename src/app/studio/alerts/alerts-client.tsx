"use client";

import type { AlertStyle } from "@/lib/types";
import { useAlerts } from "@/lib/stores/alerts";
import { useUIStore } from "@/lib/stores/ui";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils/cn";

const STYLES: { value: AlertStyle; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "hype", label: "Hype" },
  { value: "retro", label: "Retro" },
];

const ACCENTS = ["#4f8cff", "#8b5cf6", "#ff4d6d", "#22c55e", "#f59e0b"];

function AlertPreview({
  style,
  accent,
  message,
}: {
  style: AlertStyle;
  accent: string;
  message: string;
}) {
  const text = message.replace("{name}", "PixelPioneer");
  if (style === "hype") {
    return (
      <div
        className="rounded-card p-5 text-center text-white shadow-float"
        style={{ background: `linear-gradient(135deg, ${accent}, #8b5cf6)` }}
      >
        <p className="text-xs font-bold uppercase tracking-widest opacity-90">New follower</p>
        <p className="mt-1 text-xl font-extrabold">{text}</p>
      </div>
    );
  }
  if (style === "retro") {
    return (
      <div
        className="rounded-card border-2 border-dashed bg-black p-5 text-center font-mono"
        style={{ borderColor: accent, color: accent }}
      >
        <p className="text-xs uppercase tracking-widest">★ follow ★</p>
        <p className="mt-1 text-lg font-bold">{text}</p>
      </div>
    );
  }
  return (
    <div
      className="rounded-card border-l-4 bg-bg-elevated p-5 shadow-float"
      style={{ borderColor: accent }}
    >
      <p className="text-xs uppercase tracking-wide text-text-tertiary">New follower</p>
      <p className="mt-1 text-lg font-semibold">{text}</p>
    </div>
  );
}

export function AlertsClient() {
  const { style, accent, message, sound, goalLabel, goalCurrent, goalTarget, update } = useAlerts();
  const { addToast } = useUIStore();
  const goalPct = Math.min(100, Math.round((goalCurrent / Math.max(1, goalTarget)) * 100));

  return (
    <div className="section-shell py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Alerts &amp; overlays</h1>
        <p className="text-sm text-text-tertiary">
          Configure your follow alert and follower-goal widget. Saved locally; previews are mocked.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="solid-surface space-y-5">
          <div>
            <span className="mb-2 block text-sm font-medium">Alert style</span>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => update({ style: s.value })}
                  aria-pressed={style === s.value}
                  className={cn(style === s.value ? "pill-nav-active" : "pill-nav focus-ring")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium">Accent color</span>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ accent: c })}
                  aria-label={`Accent ${c}`}
                  aria-pressed={accent === c}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 focus-ring",
                    accent === c ? "border-text-primary" : "border-transparent",
                  )}
                  style={{ background: c }}
                />
              ))}
              <input
                type="color"
                value={accent}
                onChange={(e) => update({ accent: e.target.value })}
                aria-label="Custom accent color"
                className="h-8 w-12 cursor-pointer rounded border border-border-subtle bg-transparent"
              />
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Alert message</span>
            <input
              className="input-field"
              value={message}
              onChange={(e) => update({ message: e.target.value })}
            />
            <span className="mt-1 block text-xs text-text-tertiary">
              Use <code className="font-mono">{"{name}"}</code> for the follower&apos;s name.
            </span>
          </label>

          <Toggle label="Play alert sound" checked={sound} onChange={(v) => update({ sound: v })} />

          <div className="border-t border-border-subtle pt-4">
            <p className="mb-3 text-sm font-medium">Follower goal widget</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-xs text-text-secondary">Label</span>
                <input
                  className="input-field"
                  value={goalLabel}
                  onChange={(e) => update({ goalLabel: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-text-secondary">Current</span>
                <input
                  type="number"
                  className="input-field"
                  value={goalCurrent}
                  onChange={(e) => update({ goalCurrent: Number(e.target.value) || 0 })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-text-secondary">Target</span>
                <input
                  type="number"
                  className="input-field"
                  value={goalTarget}
                  onChange={(e) => update({ goalTarget: Number(e.target.value) || 0 })}
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToast("Test alert fired (mock)")}
            className="btn-primary text-sm"
          >
            Test alert
          </button>
        </section>

        <section className="space-y-5">
          <div className="solid-surface">
            <p className="mb-3 text-sm font-medium text-text-secondary">Alert preview</p>
            <AlertPreview style={style} accent={accent} message={message} />
          </div>

          <div className="solid-surface">
            <p className="mb-3 text-sm font-medium text-text-secondary">Follower goal preview</p>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{goalLabel}</span>
              <span className="tabular-nums text-text-secondary">
                {goalCurrent.toLocaleString()} / {goalTarget.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-bg-elevated-2">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${goalPct}%`, background: accent }}
              />
            </div>
            <p className="mt-2 text-xs text-text-tertiary">{goalPct}% to goal</p>
          </div>
        </section>
      </div>
    </div>
  );
}

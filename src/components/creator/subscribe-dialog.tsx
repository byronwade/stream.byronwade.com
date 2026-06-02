"use client";

import { useState } from "react";
import { SUB_TIERS, type SubTier } from "@/lib/types";
import { useSubscriptions } from "@/lib/stores/subscription";
import { useUIStore } from "@/lib/stores/ui";
import { BloomLayer } from "@/components/bloom/bloom-layer";
import { cn } from "@/lib/utils/cn";

interface SubscribeDialogProps {
  creatorId: string;
  creatorName: string;
  onDone?: () => void;
}

/** Tier picker content. Mock-only — no payment, persisted to the subscription store. */
export function SubscribeDialog({ creatorId, creatorName, onDone }: SubscribeDialogProps) {
  const { getSubscription, subscribe, unsubscribe } = useSubscriptions();
  const { addToast } = useUIStore();
  const current = getSubscription(creatorId);

  return (
    <div>
      <p className="text-sm text-text-secondary">
        Support <span className="font-medium text-text-primary">{creatorName}</span> with a mock
        subscription. No real payment is processed.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {SUB_TIERS.map((t) => {
          const active = current?.tier === t.tier;
          return (
            <div
              key={t.tier}
              className={cn(
                "flex flex-col rounded-card border p-4",
                active ? "border-accent-primary bg-accent-primary/10" : "border-border-subtle bg-bg-elevated",
              )}
            >
              <p className="text-sm font-semibold">{t.label}</p>
              <p className="text-xs text-text-tertiary">{t.priceLabel}</p>
              <ul className="mt-3 flex-1 space-y-1 text-xs text-text-secondary">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-1.5">
                    <span aria-hidden className="text-success">
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  subscribe(creatorId, t.tier as SubTier);
                  addToast(`Subscribed at ${t.label} (mock)`);
                  onDone?.();
                }}
                className={cn("mt-4 text-sm", active ? "btn-secondary" : "btn-primary")}
              >
                {active ? "Current tier" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>
      {current && (
        <button
          type="button"
          onClick={() => {
            unsubscribe(creatorId);
            addToast("Subscription cancelled (mock)");
            onDone?.();
          }}
          className="mt-4 text-xs text-danger hover:underline focus-ring"
        >
          Cancel subscription
        </button>
      )}
    </div>
  );
}

/** Self-contained subscribe button with its own Bloom dialog; for channel pages. */
export function SubscribeButton({ creatorId, creatorName }: { creatorId: string; creatorName: string }) {
  const [open, setOpen] = useState(false);
  const { isSubscribed, tierFor } = useSubscriptions();
  const subscribed = isSubscribed(creatorId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-pressed={subscribed}
        className={cn("text-sm", subscribed ? "btn-secondary" : "btn-primary")}
      >
        {subscribed ? `Subscribed · Tier ${tierFor(creatorId)}` : "Subscribe"}
      </button>
      <BloomLayer open={open} onClose={() => setOpen(false)} title={`Subscribe to ${creatorName}`}>
        <SubscribeDialog creatorId={creatorId} creatorName={creatorName} onDone={() => setOpen(false)} />
      </BloomLayer>
    </>
  );
}

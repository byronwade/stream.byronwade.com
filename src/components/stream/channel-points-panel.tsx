"use client";

import { getRewards } from "@/lib/data";
import { usePoints } from "@/lib/stores/points";
import { useUIStore } from "@/lib/stores/ui";

interface ChannelPointsPanelProps {
  creatorId: string;
  creatorName: string;
}

export function ChannelPointsPanel({ creatorId, creatorName }: ChannelPointsPanelProps) {
  const { balanceFor, spend } = usePoints();
  const { addToast } = useUIStore();
  const rewards = getRewards();
  const balance = balanceFor(creatorId);

  return (
    <div>
      <div className="flex items-center justify-between rounded-card border border-border-subtle bg-bg-elevated p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-tertiary">Your balance</p>
          <p className="text-2xl font-bold tabular-nums">{balance.toLocaleString()}</p>
          <p className="text-xs text-text-secondary">points on {creatorName}</p>
        </div>
        <span className="text-3xl" aria-hidden>
          ⭐
        </span>
      </div>
      <p className="mt-3 text-xs text-text-tertiary">
        You earn points automatically while watching live. Redemptions are mocked.
      </p>

      <ul className="mt-4 space-y-2">
        {rewards.map((r) => {
          const affordable = balance >= r.cost;
          return (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-card border border-border-subtle bg-bg-elevated p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-text-secondary">{r.description}</p>
              </div>
              <button
                type="button"
                disabled={!affordable}
                onClick={() => {
                  if (spend(creatorId, r.cost)) {
                    addToast(`Redeemed: ${r.label} (mock)`);
                  } else {
                    addToast("Not enough points yet.", "error");
                  }
                }}
                className="btn-secondary shrink-0 text-xs disabled:cursor-not-allowed disabled:opacity-40"
              >
                {r.cost.toLocaleString()} pts
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

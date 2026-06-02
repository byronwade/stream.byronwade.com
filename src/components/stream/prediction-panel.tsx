"use client";

import { useState } from "react";
import type { Prediction, Stream } from "@/lib/types";
import { getPredictionsByStreamId } from "@/lib/data";
import { usePredictions } from "@/lib/stores/prediction";
import { usePoints } from "@/lib/stores/points";
import { useUIStore } from "@/lib/stores/ui";
import { cn } from "@/lib/utils/cn";

const BET_AMOUNTS = [100, 500, 1000];

function PredictionCard({ prediction, creatorId }: { prediction: Prediction; creatorId: string }) {
  const { betFor, placeBet, resolve, resolvedOutcome } = usePredictions();
  const { balanceFor, spend, accrue } = usePoints();
  const { addToast } = useUIStore();
  const [amount, setAmount] = useState(BET_AMOUNTS[0]);

  const bet = betFor(prediction.id);
  const resolvedId = resolvedOutcome(prediction.id);
  const totalPool = prediction.outcomes.reduce((sum, o) => sum + o.seedPoints, 0) + (bet?.amount ?? 0);
  const locked = prediction.status === "locked";

  return (
    <div className="rounded-card border border-border-subtle bg-bg-elevated p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{prediction.title}</p>
        <span
          className={cn(
            "shrink-0 rounded-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            resolvedId
              ? "bg-bg-elevated-2 text-text-tertiary"
              : locked
                ? "bg-warning/15 text-warning"
                : "bg-success/15 text-success",
          )}
        >
          {resolvedId ? "Resolved" : locked ? "Locked" : "Open"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {prediction.outcomes.map((o) => {
          const pool = o.seedPoints + (bet?.outcomeId === o.id ? bet.amount : 0);
          const pct = totalPool > 0 ? Math.round((pool / totalPool) * 100) : 0;
          const isBet = bet?.outcomeId === o.id;
          const isWinner = resolvedId === o.id;
          return (
            <div key={o.id}>
              <button
                type="button"
                disabled={Boolean(bet) || Boolean(resolvedId) || locked}
                onClick={() => {
                  if (!spend(creatorId, amount)) {
                    addToast("Not enough channel points to bet.", "error");
                    return;
                  }
                  placeBet(prediction.id, o.id, amount);
                  addToast(`Bet ${amount} points on "${o.label}"`);
                }}
                className={cn(
                  "relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  isWinner
                    ? "border-success"
                    : isBet
                      ? "border-accent-primary"
                      : "border-border-subtle hover:border-accent-primary/40",
                  (Boolean(bet) || Boolean(resolvedId) || locked) && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0",
                    o.color === "blue" ? "bg-accent-primary/20" : "bg-accent-secondary/20",
                  )}
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
                <span className="relative flex items-center justify-between gap-2">
                  <span className="font-medium">
                    {o.label}
                    {isBet && " ✓"}
                    {isWinner && " 🏆"}
                  </span>
                  <span className="tabular-nums text-text-secondary">{pct}%</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {!bet && !resolvedId && !locked && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-text-tertiary">Stake:</span>
          {BET_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              aria-pressed={amount === a}
              className={cn(
                "rounded-chip px-2 py-1 text-xs",
                amount === a ? "bg-accent-primary/20 text-accent-primary" : "bg-bg-elevated-2 text-text-secondary",
              )}
            >
              {a}
            </button>
          ))}
          <span className="ml-auto text-xs text-text-tertiary">
            Balance: {balanceFor(creatorId).toLocaleString()}
          </span>
        </div>
      )}

      {bet && !resolvedId && (
        <button
          type="button"
          onClick={() => {
            const winner = prediction.outcomes[Math.floor(Math.random() * prediction.outcomes.length)];
            resolve(prediction.id, winner.id);
            if (bet.outcomeId === winner.id) {
              const winnings = bet.amount * 2;
              accrue(creatorId, winnings);
              addToast(`"${winner.label}" won! You earned ${winnings} points.`);
            } else {
              addToast(`"${winner.label}" won. Better luck next time.`, "error");
            }
          }}
          className="btn-secondary mt-3 text-xs"
        >
          Resolve (simulate outcome)
        </button>
      )}

      {bet && (
        <p className="mt-2 text-[11px] text-text-tertiary">
          You staked {bet.amount.toLocaleString()} points.
        </p>
      )}
    </div>
  );
}

export function PredictionPanel({ stream }: { stream: Stream }) {
  const predictions = getPredictionsByStreamId(stream.id);

  if (predictions.length === 0) {
    return <p className="text-center text-sm text-text-tertiary">No predictions for this stream.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        Spend channel points to predict outcomes. Resolutions are simulated locally.
      </p>
      {predictions.map((p) => (
        <PredictionCard key={p.id} prediction={p} creatorId={stream.creatorId} />
      ))}
    </div>
  );
}

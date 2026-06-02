import type { Metadata } from "next";
import { AnalyticsCard } from "@/components/studio/analytics-card";

export const metadata: Metadata = { title: "Monetization" };

const REVENUE_TREND = [180, 210, 195, 240, 260, 230, 280, 305, 290, 330, 360, 345, 390, 418];
const SUBS_TREND = [980, 1010, 1040, 1075, 1090, 1120, 1160, 1180, 1205, 1230, 1248, 1260, 1272, 1284];
const BITS_TREND = [12, 18, 15, 22, 26, 20, 28, 31, 24, 33, 29, 36, 34, 41];

const SUB_BREAKDOWN = [
  { label: "Tier 1", count: 1024, share: 80 },
  { label: "Tier 2", count: 198, share: 15 },
  { label: "Tier 3", count: 62, share: 5 },
];

const SOURCES = [
  { source: "Subscriptions", thisMonth: 3120, lastMonth: 2840 },
  { source: "Bits & cheers", thisMonth: 612, lastMonth: 540 },
  { source: "Ads", thisMonth: 318, lastMonth: 372 },
  { source: "Tips", thisMonth: 132, lastMonth: 96 },
];

function usd(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function MonetizationPage() {
  const total = SOURCES.reduce((s, x) => s + x.thisMonth, 0);
  const lastTotal = SOURCES.reduce((s, x) => s + x.lastMonth, 0);
  const deltaPct = Math.round(((total - lastTotal) / lastTotal) * 100);

  return (
    <div className="section-shell py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Monetization</h1>
        <p className="text-sm text-text-tertiary">
          Simulated revenue dashboard — all figures are mock data for the demo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Net revenue (30d)" value={usd(total)} delta={`${deltaPct >= 0 ? "+" : ""}${deltaPct}% vs last month`} chartData={REVENUE_TREND} />
        <AnalyticsCard label="Active subscribers" value={(1284).toLocaleString()} delta="+24 this week" chartData={SUBS_TREND} />
        <AnalyticsCard label="Bits (30d)" value="248K" delta="+9% vs last month" chartData={BITS_TREND} />
        <AnalyticsCard label="Est. next payout" value={usd(3960)} delta="Pays out Jun 15 (mock)" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="solid-surface">
          <h2 className="font-semibold">Revenue by source</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-text-tertiary">
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 text-right font-medium">This month</th>
                <th className="pb-2 text-right font-medium">Last month</th>
                <th className="pb-2 text-right font-medium">Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {SOURCES.map((s) => {
                const d = Math.round(((s.thisMonth - s.lastMonth) / s.lastMonth) * 100);
                return (
                  <tr key={s.source}>
                    <td className="py-2">{s.source}</td>
                    <td className="py-2 text-right tabular-nums">{usd(s.thisMonth)}</td>
                    <td className="py-2 text-right tabular-nums text-text-secondary">{usd(s.lastMonth)}</td>
                    <td className={`py-2 text-right tabular-nums ${d >= 0 ? "text-success" : "text-danger"}`}>
                      {d >= 0 ? "+" : ""}
                      {d}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border-strong font-semibold">
                <td className="pt-2">Total</td>
                <td className="pt-2 text-right tabular-nums">{usd(total)}</td>
                <td className="pt-2 text-right tabular-nums text-text-secondary">{usd(lastTotal)}</td>
                <td className={`pt-2 text-right tabular-nums ${deltaPct >= 0 ? "text-success" : "text-danger"}`}>
                  {deltaPct >= 0 ? "+" : ""}
                  {deltaPct}%
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="solid-surface">
          <h2 className="font-semibold">Subscriber mix</h2>
          <ul className="mt-4 space-y-3">
            {SUB_BREAKDOWN.map((t) => (
              <li key={t.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{t.label}</span>
                  <span className="tabular-nums text-text-secondary">
                    {t.count.toLocaleString()} · {t.share}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bg-elevated-2">
                  <div className="h-full rounded-full bg-accent-primary" style={{ width: `${t.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-text-tertiary">
            Payouts, taxes, and revenue shares are not modeled — this is a portfolio demo.
          </p>
        </section>
      </div>
    </div>
  );
}

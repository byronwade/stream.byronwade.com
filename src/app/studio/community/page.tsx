import Link from "next/link";
import { getAllCreators } from "@/lib/data";

export const metadata = { title: "Community" };

const TOP_CHATTERS = [
  { name: "PixelPioneer", messages: 1284 },
  { name: "mossandmaple", messages: 942 },
  { name: "buildmaster", messages: 877 },
  { name: "questgiver", messages: 610 },
  { name: "studioFox", messages: 533 },
];

const GOALS = [
  { label: "Follower goal", current: 12400, target: 15000 },
  { label: "Monthly clips", current: 38, target: 50 },
  { label: "Avg chat health", current: 92, target: 95 },
];

export default function StudioCommunityPage() {
  const followers = getAllCreators().slice(0, 6);

  return (
    <div className="section-shell py-8">
      <h2 className="mb-6 text-xl font-bold">Community</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="solid-surface">
          <h3 className="font-semibold">Recent followers</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {followers.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <Link href={`/channels/${c.handle}`} className="hover:text-accent-primary focus-ring">
                  {c.displayName}
                </Link>
                <span className="text-text-tertiary">@{c.handle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="solid-surface">
          <h3 className="font-semibold">Top chatters this week</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {TOP_CHATTERS.map((chatter, i) => (
              <li key={chatter.name} className="flex items-center justify-between">
                <span>
                  <span className="mr-2 text-text-tertiary tabular-nums">{i + 1}.</span>
                  {chatter.name}
                </span>
                <span className="text-text-tertiary tabular-nums">
                  {chatter.messages.toLocaleString()} msgs
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="solid-surface">
          <h3 className="font-semibold">Community goals</h3>
          <div className="mt-4 space-y-4">
            {GOALS.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <div key={goal.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{goal.label}</span>
                    <span className="text-text-tertiary tabular-nums">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg-elevated-2">
                    <div
                      className="h-full rounded-full bg-accent-primary"
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={goal.label}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="solid-surface">
          <h3 className="font-semibold">Recent feedback</h3>
          <div className="mt-4 space-y-3 text-sm text-text-secondary">
            <p>&quot;Love the chat vote mechanic!&quot; — viewer</p>
            <p>&quot;Can you do more beginner tutorials?&quot; — new viewer</p>
            <p>&quot;The catch-me-up recap is so helpful when I join late.&quot; — follower</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-text-tertiary">
        Community metrics are simulated for this portfolio demo.
      </p>
    </div>
  );
}

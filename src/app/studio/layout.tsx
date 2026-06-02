import { PillNav } from "@/components/shell/pill-nav";
import { StudioGate, StudioLockButton } from "@/components/studio/studio-gate";

const STUDIO_NAV = [
  { key: "overview", label: "Overview", href: "/studio" },
  { key: "go-live", label: "Go Live", href: "/studio/go-live" },
  { key: "manager", label: "Stream Manager", href: "/studio/stream-manager" },
  { key: "analytics", label: "Analytics", href: "/studio/analytics" },
  { key: "monetization", label: "Monetization", href: "/studio/monetization" },
  { key: "alerts", label: "Alerts", href: "/studio/alerts" },
  { key: "restream", label: "Restream", href: "/studio/restream" },
  { key: "clips", label: "Clips", href: "/studio/clips" },
  { key: "community", label: "Community", href: "/studio/community" },
  { key: "moderation", label: "Moderation", href: "/studio/moderation" },
  { key: "settings", label: "Settings", href: "/studio/settings" },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-border-subtle bg-bg-stage/50">
        <div className="section-shell py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold">Creator Studio</h1>
              <p className="text-xs text-text-tertiary">Simulated creator dashboard</p>
            </div>
            <StudioLockButton />
          </div>
          <PillNav items={STUDIO_NAV} className="mt-4 overflow-x-auto" />
        </div>
      </div>
      <StudioGate>{children}</StudioGate>
    </div>
  );
}

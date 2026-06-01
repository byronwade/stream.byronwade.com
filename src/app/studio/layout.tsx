import Link from "next/link";
import { PillNav } from "@/components/shell/pill-nav";

const STUDIO_NAV = [
  { key: "overview", label: "Overview", href: "/studio" },
  { key: "go-live", label: "Go Live", href: "/studio/go-live" },
  { key: "manager", label: "Stream Manager", href: "/studio/stream-manager" },
  { key: "analytics", label: "Analytics", href: "/studio/analytics" },
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
            <Link href="/auth/pin" className="btn-secondary text-xs">
              PIN lock
            </Link>
          </div>
          <PillNav items={STUDIO_NAV} className="mt-4 overflow-x-auto" />
        </div>
      </div>
      {children}
    </div>
  );
}

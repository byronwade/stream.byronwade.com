"use client";

import Link from "next/link";
import { useSession } from "@/lib/stores/session";

export default function StudioSettingsPage() {
  const { user, setPin } = useSession();

  return (
    <div className="section-shell py-8">
      <h2 className="mb-6 text-xl font-bold">Settings</h2>

      <div className="max-w-xl space-y-6">
        <section className="solid-surface">
          <h3 className="font-semibold">Channel</h3>
          <input type="text" defaultValue={user?.displayName ?? "Demo Creator"} className="input-field mt-3" />
          <textarea defaultValue="Creative builder streaming cozy city design." className="input-field mt-3 min-h-[80px]" />
        </section>

        <section className="solid-surface">
          <h3 className="font-semibold">Studio PIN</h3>
          <p className="mt-1 text-sm text-text-secondary">Protect sensitive settings with a demo PIN.</p>
          <button
            type="button"
            onClick={() => setPin("1234")}
            className="btn-secondary mt-3"
          >
            Set PIN to 1234
          </button>
          <Link href="/auth/pin" className="btn-primary ml-2 mt-3 inline-flex">
            Test PIN unlock
          </Link>
        </section>

        <section className="solid-surface">
          <h3 className="font-semibold">Clip defaults</h3>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="focus-ring" />
            Auto-feature clips with 100+ views
          </label>
        </section>

        <section className="solid-surface">
          <h3 className="font-semibold">Moderation defaults</h3>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="focus-ring" />
            Hold reported messages for review
          </label>
        </section>
      </div>
    </div>
  );
}

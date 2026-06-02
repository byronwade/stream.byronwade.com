"use client";

import Link from "next/link";
import { useSession } from "@/lib/stores/session";
import { useStudioSettings } from "@/lib/stores/settings";
import { useUIStore } from "@/lib/stores/ui";

export default function StudioSettingsPage() {
  const { setPin } = useSession();
  const { channelName, bio, autoFeatureClips, holdReportedMessages, updateSettings, resetSettings } =
    useStudioSettings();
  const { addToast } = useUIStore();

  return (
    <div className="section-shell py-8">
      <h2 className="mb-6 text-xl font-bold">Settings</h2>

      <div className="max-w-xl space-y-6">
        <section className="solid-surface">
          <h3 className="font-semibold">Channel</h3>
          <p className="mt-1 text-xs text-text-tertiary">Changes save automatically to this browser.</p>
          <label htmlFor="channel-name" className="muted-label mt-3 block">
            Display name
          </label>
          <input
            id="channel-name"
            type="text"
            value={channelName}
            onChange={(e) => updateSettings({ channelName: e.target.value })}
            className="input-field mt-1"
          />
          <label htmlFor="channel-bio" className="muted-label mt-3 block">
            Bio
          </label>
          <textarea
            id="channel-bio"
            value={bio}
            onChange={(e) => updateSettings({ bio: e.target.value })}
            className="input-field mt-1 min-h-[80px]"
          />
        </section>

        <section className="solid-surface">
          <h3 className="font-semibold">Studio PIN</h3>
          <p className="mt-1 text-sm text-text-secondary">Protect sensitive settings with a demo PIN.</p>
          <button
            type="button"
            onClick={() => {
              setPin("1234");
              addToast("Studio PIN set to 1234 (demo)");
            }}
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
            <input
              type="checkbox"
              checked={autoFeatureClips}
              onChange={(e) => updateSettings({ autoFeatureClips: e.target.checked })}
              className="focus-ring"
            />
            Auto-feature clips with 100+ views
          </label>
        </section>

        <section className="solid-surface">
          <h3 className="font-semibold">Moderation defaults</h3>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={holdReportedMessages}
              onChange={(e) => updateSettings({ holdReportedMessages: e.target.checked })}
              className="focus-ring"
            />
            Hold reported messages for review
          </label>
        </section>

        <button
          type="button"
          onClick={() => {
            resetSettings();
            addToast("Settings reset to defaults");
          }}
          className="btn-secondary text-sm"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

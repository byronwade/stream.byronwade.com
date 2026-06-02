"use client";

import { useState } from "react";
import { useSession } from "@/lib/stores/session";

/**
 * Mock PIN gate for the Creator Studio. Session-based: once unlocked, `pinVerified`
 * persists in the session store (localStorage) until sign-out. Demo PIN is 1234,
 * consistent with /auth/pin. No real auth is performed.
 */
export function StudioGate({ children }: { children: React.ReactNode }) {
  const { pinVerified, verifyPin } = useSession();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (pinVerified) return <>{children}</>;

  const submit = (value: string) => {
    if (verifyPin(value)) {
      setError("");
    } else {
      setError("Invalid PIN. The demo PIN is 1234.");
    }
  };

  return (
    <div className="section-shell flex min-h-[60vh] items-center justify-center py-12">
      <div className="solid-surface w-full max-w-sm text-center">
        <h2 className="text-lg font-bold">Studio locked</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Enter the studio PIN to access the creator dashboard. Demo PIN: <strong>1234</strong>.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit(pin);
          }}
        >
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••"
            aria-label="Studio PIN"
            className="input-field text-center tracking-[0.5em]"
          />
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full">
            Unlock studio
          </button>
        </form>
        <button
          type="button"
          onClick={() => submit("1234")}
          className="mt-3 text-xs text-text-tertiary hover:text-text-secondary focus-ring"
        >
          Unlock with demo PIN
        </button>
      </div>
    </div>
  );
}

/** Header control that re-locks the studio so the PIN gate can be demoed again. */
export function StudioLockButton() {
  const { pinVerified, lock } = useSession();
  if (!pinVerified) return null;
  return (
    <button type="button" onClick={lock} className="btn-secondary text-xs">
      Lock studio
    </button>
  );
}

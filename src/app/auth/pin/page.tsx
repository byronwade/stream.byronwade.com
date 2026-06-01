"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/stores/session";

export default function PinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { verifyPin, pinVerified } = useSession();
  const router = useRouter();

  const handleDigit = (d: string) => {
    if (pin.length >= 6) return;
    const next = pin + d;
    setPin(next);
    if (next.length >= 4) {
      const ok = verifyPin(next);
      if (ok) router.push("/studio/settings");
      else if (next.length >= 4) setError("Invalid PIN. Try 1234 for demo.");
    }
  };

  if (pinVerified) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p>Unlocked!</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="solid-surface w-full max-w-sm text-center">
        <h1 className="text-xl font-bold">Enter PIN</h1>
        <p className="mt-1 text-sm text-text-secondary">Demo PIN: 1234</p>
        <div className="my-6 flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="h-3 w-3 rounded-full bg-bg-elevated-2 ring-1 ring-border-subtle">
              {pin[i] ? "●" : ""}
            </span>
          ))}
        </div>
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k) => (
            <button
              key={k || "empty"}
              type="button"
              disabled={!k}
              onClick={() => (k === "⌫" ? setPin((p) => p.slice(0, -1)) : handleDigit(k))}
              className="btn-secondary aspect-square text-lg disabled:invisible"
            >
              {k}
            </button>
          ))}
        </div>
        <Link href="/studio" className="mt-6 block text-sm text-text-secondary hover:text-text-primary">
          Cancel
        </Link>
      </div>
    </div>
  );
}

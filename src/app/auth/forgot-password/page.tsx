"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="solid-surface w-full max-w-md">
        {!sent ? (
          <>
            <h1 className="text-2xl font-bold">Reset password</h1>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="input-field" />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="mt-2 text-sm text-text-secondary">
              We sent a demo reset link to {email}. This is a simulated flow — no email was sent.
            </p>
            <Link
              href="/auth/reset?token=fake_demo_token"
              className="mt-4 block rounded-xl border border-border-subtle bg-bg-elevated-2 p-4 text-sm hover:border-accent-primary/40 focus-ring"
            >
              <span className="font-mono text-accent-primary break-all">
                https://stream.demo/reset?token=fake_demo_token
              </span>
              <span className="mt-1 block text-xs text-text-tertiary">Open demo reset link →</span>
            </Link>
          </>
        )}
        <Link href="/auth/login" className="mt-4 block text-sm text-accent-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

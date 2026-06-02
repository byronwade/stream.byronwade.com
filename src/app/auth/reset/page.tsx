"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
  };

  if (!token) {
    return (
      <>
        <h1 className="text-2xl font-bold">Invalid reset link</h1>
        <p className="mt-2 text-sm text-text-secondary">
          This demo reset link is missing its token. Request a new one to continue.
        </p>
        <Link href="/auth/forgot-password" className="mt-4 block text-sm text-accent-primary hover:underline">
          Request a reset link
        </Link>
      </>
    );
  }

  if (done) {
    return (
      <>
        <h1 className="text-2xl font-bold">Password updated</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Your password was reset in this simulated flow — nothing was sent to a server.
        </p>
        <Link href="/auth/login" className="btn-primary mt-4 inline-flex">
          Sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      <p className="mt-1 text-sm text-text-secondary">Demo reset — stored nowhere, no email sent.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
          className="input-field"
          aria-label="New password"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          required
          className="input-field"
          aria-label="Confirm password"
        />
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
      <Link href="/auth/login" className="mt-4 block text-sm text-accent-primary hover:underline">
        Back to sign in
      </Link>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="solid-surface w-full max-w-md">
        <Suspense fallback={<p className="text-text-secondary">Loading…</p>}>
          <ResetContent />
        </Suspense>
      </div>
    </div>
  );
}

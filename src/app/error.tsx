"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Demo app: surface to the console only — no error-reporting backend.
    console.error(error);
  }, [error]);

  return (
    <div className="section-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="live-badge">Something broke</span>
      <h1 className="mt-4 text-2xl font-bold">This part of the stream dropped</h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">
        An unexpected error occurred while rendering this view. This is a frontend-only demo, so no
        data was lost — try again or head back home.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-text-tertiary">ref: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-secondary">
          Go home
        </Link>
      </div>
    </div>
  );
}

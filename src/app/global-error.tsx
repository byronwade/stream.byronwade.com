"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-full">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            background: "var(--color-bg-canvas, #070a12)",
            color: "var(--color-text-primary, #f5f7fb)",
            fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Stream hit a fatal error</h1>
          <p style={{ marginTop: "0.5rem", maxWidth: "28rem", opacity: 0.8 }}>
            The application failed to load. Reload to restart this frontend-only demo.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              borderRadius: "9999px",
              border: "none",
              padding: "0.6rem 1.25rem",
              fontWeight: 600,
              cursor: "pointer",
              background: "var(--color-accent-primary, #4f8cff)",
              color: "#fff",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

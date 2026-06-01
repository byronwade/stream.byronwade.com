"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/stores/session";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login({
      id: "user_demo",
      email,
      handle: email.split("@")[0] || "viewer",
      displayName: email.split("@")[0] || "Viewer",
      avatarUrl: "/media/creators/maya.svg",
      isCreator: false,
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="solid-surface w-full max-w-md">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-text-secondary">Demo auth — no real accounts.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input-field"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <Link href="/auth/forgot-password" className="text-accent-primary hover:underline">
            Forgot password?
          </Link>
          <Link href="/auth/signup" className="text-text-secondary hover:text-text-primary">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

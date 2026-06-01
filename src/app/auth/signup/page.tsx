"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/stores/session";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login({
      id: `user_${Date.now()}`,
      email,
      handle,
      displayName: handle,
      avatarUrl: "/media/creators/maya.svg",
      isCreator: false,
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="solid-surface w-full max-w-md">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-text-secondary">Demo signup — stored in localStorage only.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="input-field" />
          <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Handle" required className="input-field" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="input-field" />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <Link href="/auth/login" className="mt-4 block text-sm text-accent-primary hover:underline">
          Already have an account?
        </Link>
      </div>
    </div>
  );
}

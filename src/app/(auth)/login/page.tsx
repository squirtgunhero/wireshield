"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border-card p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <h2 className="text-[20px] font-semibold text-navy tracking-[-0.02em] mb-1">Welcome back</h2>
      <p className="text-[13px] text-slate-light mb-6">Sign in to your account</p>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-severity-critical-bg border border-severity-critical-border mb-4">
          <AlertCircle className="size-4 text-severity-critical shrink-0" />
          <p className="text-[12px] text-severity-critical font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-navy mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@wireshield.io"
            required
            className="w-full h-10 rounded-lg border border-border-card bg-white px-3 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-navy mb-1.5">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full h-10 rounded-lg border border-border-card bg-white px-3 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-border-subtle">
        <p className="text-[11px] text-slate-muted text-center">
          Demo credentials: <span className="font-mono text-slate-body">admin@wireshield.io</span> / <span className="font-mono text-slate-body">admin123</span>
        </p>
      </div>
    </div>
  );
}

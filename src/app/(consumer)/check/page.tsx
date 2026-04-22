"use client";

import { useState } from "react";
import { ScanSearch, Shield, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface AnalysisResult {
  score: number;
  level: string;
  verdict: string;
  breakdown: Array<{ factor: string; impact: number; description: string }>;
  senderDomain: string;
}

export default function FraudCheckPage() {
  const [email, setEmail] = useState("");
  const [sender, setSender] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/risk/analyze-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawEmail: email, senderAddress: sender }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="size-14 rounded-2xl bg-indigo-bg flex items-center justify-center mx-auto mb-4">
          <ScanSearch className="size-7 text-indigo" />
        </div>
        <h1 className="text-[28px] font-semibold text-navy tracking-[-0.03em] mb-2">Free fraud check</h1>
        <p className="text-[14px] text-slate-light max-w-md mx-auto">
          Paste a suspicious email and we&apos;ll analyze it for common real estate fraud patterns. No account required.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sender" className="block text-[13px] font-medium text-navy mb-1.5">Sender email address</label>
            <input
              id="sender"
              type="email"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="suspicious@example.com"
              className="w-full h-10 rounded-lg border border-border-card bg-white px-3 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-navy mb-1.5">Email content</label>
            <textarea
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Paste the full email content here..."
              rows={8}
              required
              className="w-full rounded-lg border border-border-card bg-white px-3 py-2.5 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all resize-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-indigo text-white text-[14px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ScanSearch className="size-4" />}
            {loading ? "Analyzing..." : "Analyze email"}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-border-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3 mb-4">
            {result.verdict === "VERIFIED" ? (
              <div className="size-10 rounded-lg bg-severity-safe-bg flex items-center justify-center">
                <CheckCircle2 className="size-5 text-severity-safe" />
              </div>
            ) : result.verdict === "FRAUDULENT" ? (
              <div className="size-10 rounded-lg bg-severity-critical-bg flex items-center justify-center">
                <AlertTriangle className="size-5 text-severity-critical" />
              </div>
            ) : (
              <div className="size-10 rounded-lg bg-severity-high-bg flex items-center justify-center">
                <Shield className="size-5 text-severity-high" />
              </div>
            )}
            <div>
              <p className="text-[16px] font-semibold text-navy">
                {result.verdict === "VERIFIED" ? "Looks safe" : result.verdict === "FRAUDULENT" ? "Likely fraudulent" : "Suspicious"}
              </p>
              <p className="text-[12px] text-slate-light">Risk score: {result.score}/100 ({result.level})</p>
            </div>
          </div>

          {result.breakdown.length > 0 && (
            <div className="space-y-2">
              <p className="text-[12px] font-semibold text-navy">Risk factors detected:</p>
              {result.breakdown.map((b, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-navy">{b.factor}</p>
                    <p className="text-[11px] text-slate-muted">{b.description}</p>
                  </div>
                  <span className={`text-[12px] font-semibold ${b.impact > 0 ? "text-severity-critical" : "text-severity-safe"}`}>
                    {b.impact > 0 ? "+" : ""}{b.impact}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 bg-wash rounded-lg p-4">
            <p className="text-[12px] text-slate-body">
              <strong>Important:</strong> This analysis uses pattern matching and cannot guarantee accuracy. Always verify wire instructions by calling the sender at a known phone number. Never rely solely on email for financial instructions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

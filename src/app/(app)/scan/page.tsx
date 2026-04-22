"use client";

import { useState } from "react";
import { ScanSearch, Sparkles, AlertTriangle, Shield, Mail, Globe, Link2 } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";

export default function ScanPage() {
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | {
    risk: string;
    threats: Array<{ type: string; severity: string; detail: string }>;
    summary: string;
  }>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    setTimeout(() => {
      setResult({
        risk: "HIGH",
        threats: [
          { type: "Wire fraud attempt", severity: "CRITICAL", detail: "Message requests changes to previously verified wire instructions." },
          { type: "Domain spoofing", severity: "HIGH", detail: "Sender domain 'titIe-company.com' uses homograph attack — lowercase 'I' replaces 'l'." },
          { type: "Urgency language", severity: "MEDIUM", detail: "Contains pressure phrases: 'must be completed today', 'account will be closed'." },
        ],
        summary:
          "This message exhibits multiple indicators of a Business Email Compromise (BEC) attack targeting wire transfer instructions. The sender domain appears legitimate but uses a homograph substitution. Recommend immediate verification through a known phone number before proceeding.",
      });
      setScanning(false);
    }, 1800);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[720px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-navy tracking-[-0.03em]">Threat scanner</h1>
        <p className="text-[13px] text-slate-light mt-0.5">Paste an email, message, or URL to scan for fraud indicators</p>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste email content, wire instructions, or a URL to analyze..."
          rows={8}
          className="w-full rounded-xl border border-border-card bg-white p-4 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] resize-none leading-relaxed"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!input.trim() || scanning}
            className="inline-flex h-10 items-center gap-2 px-5 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {scanning ? (
              <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <ScanSearch className="size-4" />
            )}
            {scanning ? "Analyzing..." : "Scan for threats"}
          </button>
          <div className="flex items-center gap-2 text-[11px] text-slate-muted">
            <Sparkles className="size-3.5" />
            Powered by AI
          </div>
        </div>
      </form>

      {result && (
        <div className="mt-8 space-y-4 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-severity-critical/20 bg-severity-critical-bg">
            <AlertTriangle className="size-5 text-severity-critical shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-severity-critical">High risk detected</p>
              <p className="text-[12px] text-slate-body mt-0.5">{result.threats.length} threat{result.threats.length !== 1 ? "s" : ""} identified</p>
            </div>
          </div>

          <div className="space-y-2">
            {result.threats.map((threat, i) => {
              const Icon = threat.type.includes("Wire") ? Link2 : threat.type.includes("Domain") ? Globe : Mail;
              return (
                <div key={i} className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-wash flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-slate-muted" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-navy">{threat.type}</span>
                        <SeverityBadge severity={threat.severity} size="sm" />
                      </div>
                      <p className="text-[12px] text-slate-light leading-relaxed">{threat.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-4 text-indigo" />
              <span className="text-[13px] font-semibold text-navy">AI analysis</span>
            </div>
            <p className="text-[13px] text-slate-body leading-relaxed">{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

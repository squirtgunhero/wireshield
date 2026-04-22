"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, AlertTriangle, Shield, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { TRAINING_SCENARIOS } from "@/lib/seed-data";

export default function TrainingScenarioPage() {
  const params = useParams();
  const scenario = TRAINING_SCENARIOS.find((s) => s.id === params.id);
  const [showFlags, setShowFlags] = useState(false);
  const [showAction, setShowAction] = useState(false);

  if (!scenario) {
    return (
      <div className="p-6">
        <p className="text-[14px] text-slate-muted">Scenario not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[720px]">
      <Link
        href="/training"
        className="inline-flex items-center gap-1.5 text-[13px] text-slate-muted hover:text-slate-body transition-colors mb-5"
      >
        <ArrowLeft className="size-3.5" />
        All scenarios
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-[20px] font-semibold text-navy tracking-[-0.02em]">{scenario.title}</h1>
          <SeverityBadge severity={scenario.difficulty === "Easy" ? "MEDIUM" : scenario.difficulty === "Medium" ? "HIGH" : "CRITICAL"} size="sm" />
        </div>
        <p className="text-[13px] text-slate-light">{scenario.description}</p>
        <p className="text-[11px] text-slate-muted mt-1">Role: {scenario.role}</p>
      </div>

      {/* Email */}
      <div className="bg-white rounded-xl border border-border-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden mb-6">
        <div className="border-b border-border-card px-5 py-3 bg-wash">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="size-4 text-slate-muted" />
            <span className="text-[13px] font-semibold text-navy">{scenario.email.subject}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-muted">
            <span>From: <span className="font-mono text-slate-body">{scenario.email.from}</span></span>
            <span>To: {scenario.email.to}</span>
          </div>
        </div>
        <div className="p-5">
          <pre className="text-[13px] text-slate-body leading-relaxed whitespace-pre-wrap font-sans">{scenario.email.body}</pre>
        </div>
      </div>

      {/* Red Flags */}
      <div className="mb-6">
        <button
          onClick={() => setShowFlags(!showFlags)}
          className="inline-flex h-9 items-center gap-2 px-4 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all"
        >
          {showFlags ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {showFlags ? "Hide" : "Reveal"} red flags ({scenario.redFlags.length})
        </button>

        {showFlags && (
          <div className="mt-4 space-y-2 animate-fade-in-up" style={{ opacity: 0 }}>
            {scenario.redFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <AlertTriangle className={`size-4 shrink-0 mt-0.5 ${
                  flag.severity === "CRITICAL" ? "text-severity-critical" :
                  flag.severity === "HIGH" ? "text-severity-high" : "text-severity-medium"
                }`} />
                <div>
                  <SeverityBadge severity={flag.severity} size="sm" className="mb-1" />
                  <p className="text-[13px] text-slate-body leading-relaxed">{flag.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Correct Action */}
      <div>
        <button
          onClick={() => setShowAction(!showAction)}
          className="inline-flex h-9 items-center gap-2 px-4 rounded-lg border border-border-card bg-white text-[13px] font-medium text-slate-body hover:bg-wash shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
        >
          <Shield className="size-4" />
          {showAction ? "Hide" : "Show"} recommended action
        </button>

        {showAction && (
          <div className="mt-4 bg-severity-safe-bg border border-severity-safe-border rounded-xl p-5 animate-fade-in-up" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="size-4 text-severity-safe" />
              <span className="text-[13px] font-semibold text-navy">Recommended action</span>
            </div>
            <p className="text-[13px] text-slate-body leading-relaxed">{scenario.correctAction}</p>
          </div>
        )}
      </div>
    </div>
  );
}

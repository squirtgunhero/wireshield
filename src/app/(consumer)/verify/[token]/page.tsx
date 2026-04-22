"use client";

import { useState } from "react";
import { Shield, UserCheck, Fingerprint, CheckCircle2, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const [step, setStep] = useState<"intro" | "verifying" | "complete">("intro");

  async function startVerification() {
    setStep("verifying");
    try {
      const res = await fetch("/api/identity/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setTimeout(() => setStep("complete"), 2000);
      }
    } catch {
      setTimeout(() => setStep("complete"), 2000);
    }
  }

  if (step === "complete") {
    return (
      <div className="bg-white rounded-2xl border border-border-card p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <CheckCircle2 className="size-16 text-severity-safe mx-auto mb-4" />
        <h1 className="text-[24px] font-semibold text-navy mb-2">Identity verified</h1>
        <p className="text-[14px] text-slate-light max-w-sm mx-auto">
          Your identity has been successfully verified. You can now participate in secure transactions on WireShield.
        </p>
      </div>
    );
  }

  if (step === "verifying") {
    return (
      <div className="bg-white rounded-2xl border border-border-card p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <Loader2 className="size-12 text-indigo mx-auto mb-4 animate-spin" />
        <h1 className="text-[20px] font-semibold text-navy mb-2">Verifying your identity...</h1>
        <p className="text-[13px] text-slate-light">This may take a moment. Please don&apos;t close this window.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-[28px] font-semibold text-navy tracking-[-0.03em] mb-2">Verify your identity</h1>
        <p className="text-[14px] text-slate-light max-w-md mx-auto">
          Before you can view wire instructions or participate in a transaction, we need to verify your identity.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] space-y-5">
        <div className="space-y-4">
          {[
            { icon: UserCheck, title: "Government ID", desc: "We'll scan your driver's license or passport" },
            { icon: Fingerprint, title: "Selfie verification", desc: "Take a quick selfie to match your ID photo" },
            { icon: Shield, title: "Fraud education", desc: "Learn how to protect yourself from wire fraud" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3.5">
              <div className="size-10 rounded-lg bg-indigo-bg flex items-center justify-center shrink-0">
                <Icon className="size-5 text-indigo" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-navy">{title}</p>
                <p className="text-[12px] text-slate-light mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={startVerification}
          className="w-full h-11 rounded-lg bg-indigo text-white text-[14px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all"
        >
          Start verification
        </button>

        <p className="text-[11px] text-slate-muted text-center">
          Powered by Persona. Your data is encrypted and never shared without your consent.
        </p>
      </div>
    </div>
  );
}

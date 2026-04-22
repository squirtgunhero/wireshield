"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Clock, AlertTriangle, Eye } from "lucide-react";

interface SecureViewerProps {
  wireId: string;
  recipientName: string;
  bankName: string;
  routingNumber: string;
  accountHolderName: string;
  amount?: string | number | null;
  expiresAt: string;
}

export function SecureViewer({
  wireId,
  recipientName,
  bankName,
  routingNumber,
  accountHolderName,
  amount,
  expiresAt,
}: SecureViewerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expired, setExpired] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const calcTimeLeft = useCallback(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) { setExpired(true); setRevealed(false); return 0; }
    return Math.floor(diff / 1000);
  }, [expiresAt]);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const iv = setInterval(() => {
      const t = calcTimeLeft();
      setTimeLeft(t);
      if (t <= 0) clearInterval(iv);
    }, 1000);
    return () => clearInterval(iv);
  }, [calcTimeLeft]);

  useEffect(() => {
    function prevent(e: Event) { e.preventDefault(); }
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const watermark = `${recipientName} • ${new Date().toISOString().slice(0, 16)} • ${wireId.slice(0, 8)}`;

  if (expired) {
    return (
      <div className="bg-white rounded-2xl border border-border-card p-8 text-center max-w-lg mx-auto">
        <AlertTriangle className="size-12 text-severity-high mx-auto mb-3" />
        <h2 className="text-[18px] font-semibold text-navy mb-1">Session expired</h2>
        <p className="text-[13px] text-slate-light">
          This wire instruction view has expired for security purposes. Please request a new delivery link.
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-w-lg mx-auto select-none" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-[0.04]">
        {Array.from({ length: 8 }).map((_, i) => (
          <p
            key={i}
            className="text-[11px] text-navy font-mono whitespace-nowrap"
            style={{ transform: `rotate(-30deg) translateY(${i * 80}px) translateX(-50px)` }}
          >
            {watermark} &nbsp;&nbsp;&nbsp; {watermark} &nbsp;&nbsp;&nbsp; {watermark}
          </p>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border-card shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="bg-indigo-bg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-indigo" />
            <span className="text-[14px] font-semibold text-navy">Secure Wire Instructions</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-mono">
            <Clock className="size-3.5 text-slate-muted" />
            <span className={timeLeft < 120 ? "text-severity-critical font-semibold" : "text-slate-body"}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center pb-4 border-b border-border-subtle">
            <p className="text-[11px] text-slate-muted uppercase tracking-wider mb-1">Prepared for</p>
            <p className="text-[16px] font-semibold text-navy">{recipientName}</p>
          </div>

          {!revealed ? (
            <div className="text-center py-6">
              <Eye className="size-8 text-slate-muted mx-auto mb-3" />
              <p className="text-[13px] text-slate-body mb-3">Wire details are hidden for security</p>
              <button
                onClick={() => setRevealed(true)}
                className="inline-flex h-10 items-center gap-2 px-5 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all"
              >
                <Eye className="size-4" /> Reveal wire details
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-slate-muted uppercase tracking-wider mb-1">Bank name</p>
                <p className="text-[15px] font-medium text-navy">{bankName}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-muted uppercase tracking-wider mb-1">Routing number</p>
                <p className="text-[15px] font-mono font-medium text-navy tracking-wider">{routingNumber}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-muted uppercase tracking-wider mb-1">Account holder</p>
                <p className="text-[15px] font-medium text-navy">{accountHolderName}</p>
              </div>
              {amount && (
                <div>
                  <p className="text-[11px] text-slate-muted uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-[18px] font-semibold text-navy">${Number(amount).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-border-subtle">
            <div className="bg-wash rounded-lg p-3 text-center">
              <p className="text-[11px] text-slate-muted">
                This view is watermarked and will expire in {minutes}m {seconds}s. Do not share, copy, or screenshot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

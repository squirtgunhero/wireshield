"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Banknote, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { formatCurrency } from "@/lib/utils/format";

interface WireData {
  id: string;
  direction: string;
  bankName: string;
  amount: number | string | null;
  status: string;
  accountHolderName: string;
  fromParty?: { id: string; name: string; role: string } | null;
  toParty?: { id: string; name: string; role: string } | null;
  plaidVerified: boolean;
  confirmedAt?: string | null;
  flaggedAt?: string | null;
  flagReason?: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending", VERIFIED: "Verified", DELIVERED: "Delivered",
  CONFIRMED: "Confirmed", FLAGGED: "Flagged", EXPIRED: "Expired", CANCELLED: "Cancelled",
};

export default function WiresPage() {
  const params = useParams();
  const txId = params.id as string;
  const [wires, setWires] = useState<WireData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transactions/${txId}`);
        if (res.ok) {
          const { transaction } = await res.json();
          if (transaction.wireInstructions?.length > 0) {
            setWires(transaction.wireInstructions);
            setLoading(false);
            return;
          }
        }
      } catch { /* fallback */ }
      setWires([]);
      setLoading(false);
    }
    load();
  }, [txId]);

  if (loading) return <div className="p-6 text-center text-slate-muted text-[13px]">Loading wires...</div>;

  return (
    <div className="p-4 sm:p-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-[15px] font-semibold text-navy">Wire instructions</h2>
          <p className="text-[12px] text-slate-light mt-0.5">{wires.length} wire{wires.length !== 1 ? "s" : ""} tracked</p>
        </div>
      </div>

      {wires.length === 0 && (
        <div className="bg-white rounded-xl border border-border-card p-8 text-center">
          <Banknote className="size-8 text-slate-muted mx-auto mb-2" />
          <p className="text-[13px] text-slate-body">No wire instructions yet</p>
        </div>
      )}

      {wires.map((wire) => (
        <div key={wire.id} className="bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-indigo-bg flex items-center justify-center">
                <Banknote className="size-[18px] text-indigo" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-semibold text-navy">{wire.amount ? formatCurrency(wire.amount) : "—"}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    wire.status === "CONFIRMED" ? "bg-severity-safe-bg text-severity-safe border border-severity-safe-border"
                      : wire.status === "FLAGGED" ? "bg-severity-critical-bg text-severity-critical border border-severity-critical-border"
                      : "bg-wash text-slate-muted border border-border-card"
                  }`}>
                    {STATUS_LABELS[wire.status] ?? wire.status}
                  </span>
                </div>
                <p className="text-[12px] text-slate-muted mt-0.5">{wire.bankName} — {wire.direction.toLowerCase()}</p>
              </div>
            </div>
            {wire.plaidVerified ? (
              <span className="flex items-center gap-1 text-[11px] text-severity-safe font-medium">
                <ShieldCheck className="size-3.5" /> Plaid verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-severity-high font-medium">
                <AlertTriangle className="size-3.5" /> Not verified
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-wash rounded-lg p-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-muted mb-0.5">From</p>
              <p className="text-[13px] font-medium text-navy truncate">{wire.fromParty?.name ?? wire.accountHolderName}</p>
            </div>
            <ArrowRight className="size-4 text-slate-muted shrink-0 rotate-90 sm:rotate-0 self-center" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-muted mb-0.5">To</p>
              <p className="text-[13px] font-medium text-navy truncate">{wire.toParty?.name ?? "—"}</p>
            </div>
          </div>

          {wire.flaggedAt && (
            <div className="mt-3 rounded-lg border border-severity-critical/15 bg-severity-critical-bg p-3">
              <div className="flex items-center gap-2 mb-1">
                <SeverityBadge severity="CRITICAL" size="sm" />
                <span className="text-[12px] font-semibold text-severity-critical">{wire.flagReason ?? "Flagged"}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

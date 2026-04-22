"use client";

import Link from "next/link";
import { MapPin, Users, AlertTriangle, Calendar } from "lucide-react";
import { PipelineMini } from "./pipeline-mini";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface TxCardProps {
  id: string;
  displayId: string;
  address: string;
  city: string;
  state: string;
  currentPhase: string;
  closingDate?: string | Date | null;
  contractPrice?: string | number | null;
  alertCount?: number;
  partyCount?: number;
}

export function TxCard({
  id,
  displayId,
  address,
  city,
  state,
  currentPhase,
  closingDate,
  contractPrice,
  alertCount = 0,
  partyCount = 0,
}: TxCardProps) {
  return (
    <Link
      href={`/transactions/${id}`}
      className="block bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-border-card transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] text-slate-muted font-mono">{displayId}</p>
          <h3 className="text-[15px] font-semibold text-navy mt-0.5 tracking-[-0.01em]">{address}</h3>
          <p className="flex items-center gap-1 text-[12px] text-slate-light mt-0.5">
            <MapPin className="size-3" />
            {city}, {state}
          </p>
        </div>
        {contractPrice && (
          <span className="text-[14px] font-semibold text-navy tracking-[-0.02em]">
            {formatCurrency(contractPrice)}
          </span>
        )}
      </div>

      <PipelineMini currentPhase={currentPhase} className="mb-3" />

      <div className="flex items-center gap-3 text-[11px] text-slate-muted">
        {closingDate && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(closingDate)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="size-3" />
          {partyCount} parties
        </span>
        {alertCount > 0 && (
          <span className="flex items-center gap-1 text-severity-critical font-medium">
            <AlertTriangle className="size-3" />
            {alertCount} alert{alertCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </Link>
  );
}

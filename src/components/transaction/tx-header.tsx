"use client";

import { MapPin, Calendar, DollarSign } from "lucide-react";
import { Pipeline } from "./pipeline";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface TxHeaderProps {
  displayId: string;
  address: string;
  city: string;
  state: string;
  contractPrice?: string | number | null;
  closingDate?: string | Date | null;
  currentPhase: string;
  threatPhases?: string[];
  alertCounts?: { critical: number; high: number; medium: number; clear: number };
}

export function TxHeader({
  displayId,
  address,
  city,
  state,
  contractPrice,
  closingDate,
  currentPhase,
  threatPhases = [],
  alertCounts = { critical: 0, high: 0, medium: 0, clear: 0 },
}: TxHeaderProps) {
  return (
    <div className="bg-white border-b border-border-card">
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-muted font-mono mb-0.5">{displayId}</p>
            <h1 className="text-[18px] sm:text-[20px] font-semibold text-navy tracking-[-0.02em] truncate">{address}</h1>
            <p className="flex items-center gap-1 text-[13px] text-slate-light mt-0.5">
              <MapPin className="size-3.5 shrink-0" />
              {city}, {state}
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            {contractPrice && (
              <div className="sm:text-right">
                <p className="text-[11px] text-slate-muted">Contract price</p>
                <p className="text-[16px] sm:text-[18px] font-semibold text-navy tracking-[-0.02em] flex items-center gap-0.5">
                  <DollarSign className="size-4 text-slate-muted" />
                  {formatCurrency(contractPrice).replace("$", "")}
                </p>
              </div>
            )}
            {closingDate && (
              <div className="sm:text-right">
                <p className="text-[11px] text-slate-muted">Closing</p>
                <p className="text-[13px] font-medium text-slate-body flex items-center gap-1">
                  <Calendar className="size-3.5 text-slate-muted" />
                  {formatDate(closingDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {alertCounts.critical > 0 && <SeverityBadge severity="CRITICAL" size="sm" />}
          {alertCounts.high > 0 && <SeverityBadge severity="HIGH" size="sm" />}
          {alertCounts.medium > 0 && <SeverityBadge severity="MEDIUM" size="sm" />}
          {alertCounts.critical === 0 && alertCounts.high === 0 && alertCounts.medium === 0 && (
            <SeverityBadge severity="SAFE" size="sm" />
          )}
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <Pipeline currentPhase={currentPhase} threatPhases={threatPhases} className="min-w-[480px]" />
        </div>
      </div>
    </div>
  );
}

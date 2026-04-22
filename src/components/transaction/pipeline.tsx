"use client";

import { Check } from "lucide-react";
import { PHASES, PHASE_INDEX } from "@/lib/constants";

interface PipelineProps {
  currentPhase: string;
  threatPhases?: string[];
  className?: string;
}

export function Pipeline({ currentPhase, threatPhases = [], className = "" }: PipelineProps) {
  const currentIdx = PHASE_INDEX[currentPhase] ?? 0;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {PHASES.map((phase, idx) => {
        const isActive = idx === currentIdx;
        const isPast = idx < currentIdx;
        const hasThreat = threatPhases.includes(phase.key);

        return (
          <div key={phase.key} className="flex-1 min-w-0">
            <div
              className={`relative rounded-lg px-2.5 py-2 text-center text-[11px] font-medium transition-all ${
                isActive
                  ? "bg-indigo text-white shadow-[0_1px_3px_rgba(0,166,126,0.3)]"
                  : isPast
                    ? "bg-white border border-border-card text-slate-body"
                    : "bg-wash/80 text-slate-muted border border-transparent"
              }`}
            >
              {hasThreat && (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-severity-critical rounded-t-lg" />
              )}
              <div className="flex items-center justify-center gap-1">
                {isPast && <Check className="size-3 text-severity-safe shrink-0" />}
                <span className="truncate">{phase.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

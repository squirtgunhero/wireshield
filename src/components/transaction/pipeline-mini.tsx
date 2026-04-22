"use client";

import { PHASES, PHASE_INDEX } from "@/lib/constants";

interface PipelineMiniProps {
  currentPhase: string;
  className?: string;
}

export function PipelineMini({ currentPhase, className = "" }: PipelineMiniProps) {
  const currentIdx = PHASE_INDEX[currentPhase] ?? 0;

  return (
    <div className={`flex items-center gap-[3px] ${className}`}>
      {PHASES.map((phase, idx) => (
        <div
          key={phase.key}
          className={`h-[3px] flex-1 rounded-full transition-colors ${
            idx <= currentIdx
              ? "bg-indigo"
              : "bg-border-card"
          }`}
          title={phase.label}
        />
      ))}
    </div>
  );
}

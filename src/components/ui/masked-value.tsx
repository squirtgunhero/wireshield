"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface MaskedValueProps {
  last4: string | null | undefined;
  fullLabel?: string;
  className?: string;
}

export function MaskedValue({ last4, fullLabel = "value", className = "" }: MaskedValueProps) {
  const [revealed] = useState(false);

  if (!last4) return <span className={`text-slate-muted ${className}`}>Not provided</span>;

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[13px] ${className}`}>
      {revealed ? (
        <>
          <span className="text-navy">{fullLabel}</span>
          <button className="text-slate-muted hover:text-indigo transition-colors">
            <EyeOff className="size-3.5" />
          </button>
        </>
      ) : (
        <>
          <span className="text-slate-body tracking-wide">{"•••••"}{last4}</span>
          <button className="text-slate-muted hover:text-indigo transition-colors">
            <Eye className="size-3.5" />
          </button>
        </>
      )}
    </span>
  );
}

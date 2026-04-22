"use client";

import { SEVERITY_CONFIG } from "@/lib/constants";

type SeverityKey = keyof typeof SEVERITY_CONFIG;

interface SeverityBadgeProps {
  severity: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function SeverityBadge({ severity, size = "default", className = "" }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity as SeverityKey] ?? SEVERITY_CONFIG.SAFE;

  const sizeClasses = {
    sm: "text-[11px] px-1.5 py-px",
    default: "text-[11px] px-2 py-0.5",
    lg: "text-[12px] px-2.5 py-[3px]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        className="size-[5px] rounded-full shrink-0"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}

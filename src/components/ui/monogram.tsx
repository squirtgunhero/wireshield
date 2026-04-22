"use client";

import { PARTY_COLORS } from "@/lib/constants";

interface MonogramProps {
  type: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Monogram({ type, size = "md", className = "" }: MonogramProps) {
  const config = PARTY_COLORS[type] ?? PARTY_COLORS.OTHER;

  const sizeMap = {
    sm: { box: 30, text: "text-[11px]" },
    md: { box: 38, text: "text-[12px]" },
    lg: { box: 46, text: "text-[14px]" },
  };

  const s = sizeMap[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-semibold shrink-0 ${s.text} ${className}`}
      style={{
        width: s.box,
        height: s.box,
        backgroundColor: `${config.color}0A`,
        border: `1px solid ${config.color}18`,
        color: config.color,
      }}
    >
      {config.abbr}
    </span>
  );
}

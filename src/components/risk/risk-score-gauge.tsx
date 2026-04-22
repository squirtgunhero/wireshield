"use client";

interface RiskScoreGaugeProps {
  score: number;
  level: string;
  size?: "sm" | "md" | "lg";
}

export function RiskScoreGauge({ score, level, size = "md" }: RiskScoreGaugeProps) {
  const sizes = { sm: 80, md: 120, lg: 160 };
  const s = sizes[size];
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const radius = (s - strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const filled = (score / 100) * circumference;

  const colors: Record<string, string> = {
    LOW: "#00A67E",
    MEDIUM: "#F59E0B",
    HIGH: "#EF4444",
    CRITICAL: "#991B1B",
    PENDING: "#94A3B8",
  };

  const color = colors[level] ?? colors.PENDING;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={s} height={s / 2 + 10} viewBox={`0 0 ${s} ${s / 2 + 10}`}>
        <path
          d={`M ${strokeWidth / 2} ${s / 2} A ${radius} ${radius} 0 0 1 ${s - strokeWidth / 2} ${s / 2}`}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={`M ${strokeWidth / 2} ${s / 2} A ${radius} ${radius} 0 0 1 ${s - strokeWidth / 2} ${s / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        <text x={s / 2} y={s / 2 - 5} textAnchor="middle" className="text-navy" style={{ fontSize: size === "sm" ? 18 : size === "md" ? 28 : 36, fontWeight: 700 }}>
          {score}
        </text>
      </svg>
      <span
        className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      >
        {level}
      </span>
    </div>
  );
}

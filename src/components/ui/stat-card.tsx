import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
  accent?: "teal" | "amber" | "blue" | "violet";
}

const ACCENT_STYLES = {
  teal:   { bg: "linear-gradient(145deg, #E6F1EE, #D0E8E1)", shadow: "0 2px 6px rgba(14,124,102,0.12)", color: "#0A5A4A" },
  amber:  { bg: "linear-gradient(145deg, #FBF0DC, #F5E2B8)", shadow: "0 2px 6px rgba(185,121,8,0.12)", color: "#8B6914" },
  blue:   { bg: "linear-gradient(145deg, #E3EDF7, #C8DCF0)", shadow: "0 2px 6px rgba(37,99,170,0.12)", color: "#2563AA" },
  violet: { bg: "linear-gradient(145deg, #EDE3F7, #D8C8F0)", shadow: "0 2px 6px rgba(109,40,217,0.12)", color: "#6D28D9" },
};

export function StatCard({ label, value, icon: Icon, trend, className = "", accent = "teal" }: StatCardProps) {
  const s = ACCENT_STYLES[accent];

  return (
    <div className={`bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] text-slate-muted font-medium">{label}</p>
          <p className="text-[22px] font-semibold text-navy tracking-[-0.03em] mt-1">{value}</p>
          {trend && <p className="text-[11px] text-slate-muted mt-0.5">{trend}</p>}
        </div>
        {Icon && (
          <div
            className="size-10 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: s.bg, boxShadow: `${s.shadow}, inset 0 1px 0 rgba(255,255,255,0.5)` }}
          >
            <Icon className="size-[18px]" style={{ color: s.color }} strokeWidth={1.8} />
          </div>
        )}
      </div>
    </div>
  );
}

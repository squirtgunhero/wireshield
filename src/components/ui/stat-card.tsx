import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] text-slate-muted font-medium">{label}</p>
          <p className="text-[22px] font-semibold text-navy tracking-[-0.03em] mt-1">{value}</p>
          {trend && <p className="text-[11px] text-slate-muted mt-0.5">{trend}</p>}
        </div>
        {Icon && (
          <div className="size-9 rounded-lg bg-wash flex items-center justify-center">
            <Icon className="size-[18px] text-slate-muted" />
          </div>
        )}
      </div>
    </div>
  );
}

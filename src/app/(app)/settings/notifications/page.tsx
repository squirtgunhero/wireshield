"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Smartphone } from "lucide-react";

const NOTIFICATION_SETTINGS = [
  { id: "critical", label: "Critical alerts", desc: "Wire fraud, active attacks, compromised credentials", checked: true },
  { id: "high", label: "High severity", desc: "Suspicious communications, unverified parties", checked: true },
  { id: "medium", label: "Medium severity", desc: "Domain anomalies, document discrepancies", checked: true },
  { id: "low", label: "Low severity", desc: "Minor issues and informational notices", checked: false },
  { id: "phase", label: "Phase changes", desc: "Transaction milestone updates", checked: true },
  { id: "digest", label: "Daily digest", desc: "Summary of all activity from the past 24 hours", checked: false },
];

export default function NotificationsPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[640px]">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-[13px] text-slate-muted hover:text-slate-body transition-colors mb-5"
      >
        <ArrowLeft className="size-3.5" />
        Settings
      </Link>

      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-navy tracking-[-0.03em]">Notifications</h1>
        <p className="text-[13px] text-slate-light mt-0.5">Choose which alerts you receive and how</p>
      </div>

      <div className="mb-8">
        <h3 className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider mb-3">Delivery channels</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Mail, label: "Email", active: true },
            { icon: Smartphone, label: "Push", active: false },
            { icon: MessageSquare, label: "Slack", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all ${
                active
                  ? "border-indigo bg-indigo-bg text-indigo"
                  : "border-border-card bg-white text-slate-muted hover:bg-wash"
              } shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
            >
              <Icon className="size-5" />
              <span className="text-[12px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider mb-3">Alert types</h3>
        <div className="space-y-1">
          {NOTIFICATION_SETTINGS.map(({ id, label, desc, checked }) => (
            <label
              key={id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border-card bg-white hover:bg-wash transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div>
                <p className="text-[13px] font-medium text-navy">{label}</p>
                <p className="text-[12px] text-slate-light">{desc}</p>
              </div>
              <div className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-indigo" : "bg-border-card"}`}>
                <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button className="inline-flex h-10 items-center px-5 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all">
          Save preferences
        </button>
      </div>
    </div>
  );
}

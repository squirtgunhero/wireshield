"use client";

import { Globe, TrendingUp, Eye, Shield, AlertTriangle, Cpu } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";

const THREAT_FEED = [
  { id: "1", title: "New BEC campaign targeting real estate closings in Texas", severity: "CRITICAL", source: "FBI IC3", date: "2 hours ago", detail: "Active campaign using compromised title company email accounts." },
  { id: "2", title: "Phishing kit 'CloserFraud' distributed on dark web", severity: "HIGH", source: "FS-ISAC", date: "6 hours ago", detail: "New phishing kit specifically designed to impersonate escrow platforms." },
  { id: "3", title: "Domain typosquatting spike — '.homes' TLD", severity: "MEDIUM", source: "WireShield Intel", date: "1 day ago", detail: "340% increase in registration of .homes domains matching title company names." },
  { id: "4", title: "Wire fraud losses exceed $400M in Q1 2025", severity: "HIGH", source: "FinCEN", date: "3 days ago", detail: "Real estate wire fraud continues to be the fastest growing cybercrime category." },
  { id: "5", title: "Seller impersonation scheme — vacant land transactions", severity: "CRITICAL", source: "ALTA", date: "5 days ago", detail: "Organized rings filing fraudulent deeds on unoccupied parcels to initiate sales." },
];

export default function IntelPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[860px]">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-[20px] sm:text-[22px] font-semibold text-navy tracking-[-0.03em]">Threat intelligence</h1>
        <p className="text-[13px] text-slate-light mt-0.5">Real-time cybercrime intelligence for real estate</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Active threats", value: "23", icon: AlertTriangle },
          { label: "Monitored domains", value: "1,847", icon: Globe },
          { label: "Patterns detected", value: "156", icon: Cpu },
          { label: "Risk trend", value: "Elevated", icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-slate-muted font-medium">{label}</p>
              <Icon className="size-4 text-slate-muted" />
            </div>
            <p className="text-[18px] font-semibold text-navy">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-[15px] font-semibold text-navy mb-3">Latest intelligence</h2>
      <div className="space-y-2">
        {THREAT_FEED.map((item, i) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 animate-fade-in-up stagger-${i + 1}`}
            style={{ opacity: 0 }}
          >
            <div className="flex items-start gap-3.5">
              <div className="size-9 rounded-lg bg-wash flex items-center justify-center shrink-0">
                <Shield className="size-[18px] text-slate-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <SeverityBadge severity={item.severity} size="sm" />
                  <span className="text-[11px] text-slate-muted">{item.date}</span>
                </div>
                <h3 className="text-[13px] font-semibold text-navy mt-0.5">{item.title}</h3>
                <p className="text-[12px] text-slate-light mt-0.5">{item.detail}</p>
                <p className="text-[11px] text-slate-muted mt-1.5">Source: {item.source}</p>
              </div>
              <button className="size-8 rounded-md flex items-center justify-center text-slate-muted hover:text-navy hover:bg-wash transition-colors shrink-0">
                <Eye className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

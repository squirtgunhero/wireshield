"use client";

import Link from "next/link";
import { User, Building2, Shield, Bell, Key, ArrowRight } from "lucide-react";

const SETTINGS_SECTIONS = [
  { href: "/settings/notifications", icon: Bell, title: "Notifications", desc: "Alert preferences and delivery channels" },
  { href: "#", icon: User, title: "Profile", desc: "Your personal information and preferences" },
  { href: "#", icon: Building2, title: "Organization", desc: "Team members, roles, and permissions" },
  { href: "#", icon: Shield, title: "Security", desc: "Two-factor auth, sessions, and API keys" },
  { href: "#", icon: Key, title: "API access", desc: "Manage API keys and webhook endpoints" },
];

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[640px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-navy tracking-[-0.03em]">Settings</h1>
        <p className="text-[13px] text-slate-light mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="space-y-2">
        {SETTINGS_SECTIONS.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={title}
            href={href}
            className="flex items-center gap-3.5 bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 group"
          >
            <div className="size-9 rounded-lg bg-wash flex items-center justify-center">
              <Icon className="size-[18px] text-slate-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-navy group-hover:text-indigo transition-colors">{title}</p>
              <p className="text-[12px] text-slate-light">{desc}</p>
            </div>
            <ArrowRight className="size-4 text-slate-muted group-hover:text-indigo transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

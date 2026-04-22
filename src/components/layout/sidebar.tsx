"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  ScanSearch,
  GraduationCap,
  ShieldAlert,
  Settings,
  Shield,
  X,
  Scale,
  BarChart3,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: FolderOpen, label: "Transactions" },
  { href: "/scan", icon: ScanSearch, label: "Scanner" },
  { href: "/training", icon: GraduationCap, label: "Training" },
  { href: "/intel", icon: ShieldAlert, label: "Intelligence" },
  { href: "/compliance", icon: Scale, label: "Compliance" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col bg-white border-r border-border-card transition-transform duration-200 ease-out lg:translate-x-0 lg:z-30 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[60px] items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo flex items-center justify-center">
              <Shield className="size-[18px] text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold text-navy tracking-[-0.02em]">
              WireShield
            </span>
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-md flex items-center justify-center text-slate-muted hover:text-slate-body hover:bg-wash lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] transition-all duration-150 ${
                  active
                    ? "bg-indigo-bg text-indigo font-medium"
                    : "text-slate-light hover:bg-wash hover:text-slate-body"
                }`}
              >
                <Icon className={`size-[16px] ${active ? "text-indigo" : ""}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border-card">
          <p className="text-[11px] text-slate-muted">Protected by WireShield</p>
        </div>
      </aside>
    </>
  );
}

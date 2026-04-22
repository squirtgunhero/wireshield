"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

function DuoIcon({ icon, active }: { icon: string; active: boolean }) {
  const fill = active ? "rgba(0,166,126,0.18)" : "rgba(0,0,0,0.06)";
  const stroke = active ? "#00A67E" : "#6B7B8D";
  const p: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="2" fill={fill}/><rect x="3" y="3" width="8" height="8" rx="2" stroke={stroke} strokeWidth="1.6"/>
        <rect x="13" y="3" width="8" height="5" rx="2" fill={fill}/><rect x="13" y="3" width="8" height="5" rx="2" stroke={stroke} strokeWidth="1.6"/>
        <rect x="13" y="11" width="8" height="10" rx="2" fill={fill}/><rect x="13" y="11" width="8" height="10" rx="2" stroke={stroke} strokeWidth="1.6"/>
        <rect x="3" y="14" width="8" height="7" rx="2" fill={fill}/><rect x="3" y="14" width="8" height="7" rx="2" stroke={stroke} strokeWidth="1.6"/>
      </svg>
    ),
    transactions: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" fill={fill}/>
        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke={stroke} strokeWidth="1.6"/>
        <path d="M2 9h20" stroke={stroke} strokeWidth="1.4" opacity="0.5"/>
        <path d="M7 14h4M7 17h2" stroke={stroke} strokeWidth="1.6"/>
      </svg>
    ),
    scanner: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" fill={fill}/>
        <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth="1.6"/>
        <path d="M4 7V5a1 1 0 011-1h2M17 4h2a1 1 0 011 1v2M20 17v2a1 1 0 01-1 1h-2M7 20H5a1 1 0 01-1-1v-2" stroke={stroke} strokeWidth="1.6"/>
      </svg>
    ),
    training: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L2 8l10 5 10-5-10-5z" fill={fill}/>
        <path d="M12 3L2 8l10 5 10-5-10-5z" stroke={stroke} strokeWidth="1.6"/>
        <path d="M2 15l10 5 10-5" stroke={stroke} strokeWidth="1.6"/>
        <path d="M2 11.5l10 5 10-5" stroke={stroke} strokeWidth="1.4" opacity="0.4"/>
      </svg>
    ),
    intel: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" fill={fill}/>
        <path d="M12 2L4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" stroke={stroke} strokeWidth="1.6"/>
        <path d="M12 9v4M12 16h.01" stroke={stroke} strokeWidth="2"/>
      </svg>
    ),
    compliance: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 2 7.5v9L12 21l10-4.5v-9L12 3z" fill={fill}/>
        <path d="M12 3 2 7.5v9L12 21l10-4.5v-9L12 3z" stroke={stroke} strokeWidth="1.6"/>
        <path d="M2 7.5L12 12l10-4.5M12 21V12" stroke={stroke} strokeWidth="1.4" opacity="0.5"/>
      </svg>
    ),
    analytics: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="12" width="4" height="9" rx="1" fill={fill}/><rect x="3" y="12" width="4" height="9" rx="1" stroke={stroke} strokeWidth="1.6"/>
        <rect x="10" y="6" width="4" height="15" rx="1" fill={fill}/><rect x="10" y="6" width="4" height="15" rx="1" stroke={stroke} strokeWidth="1.6"/>
        <rect x="17" y="3" width="4" height="18" rx="1" fill={fill}/><rect x="17" y="3" width="4" height="18" rx="1" stroke={stroke} strokeWidth="1.6"/>
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" fill={fill}/><circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.6"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={stroke} strokeWidth="1.6"/>
      </svg>
    ),
  };
  return <>{p[icon]}</>;
}

const NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/transactions", icon: "transactions", label: "Transactions" },
  { href: "/scan", icon: "scanner", label: "Scanner" },
  { href: "/training", icon: "training", label: "Training" },
  { href: "/intel", icon: "intel", label: "Intelligence" },
  { href: "/compliance", icon: "compliance", label: "Compliance" },
  { href: "/analytics", icon: "analytics", label: "Analytics" },
  { href: "/settings", icon: "settings", label: "Settings" },
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
            <div className="size-8 rounded-lg flex items-center justify-center relative overflow-hidden" style={{
              background: "linear-gradient(145deg, #00B88C, #00896A)",
              boxShadow: "0 2px 8px rgba(0,166,126,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" fill="rgba(255,255,255,0.2)"/>
                <path d="M12 2L4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" stroke="white" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2"/>
              </svg>
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
          {NAV_ITEMS.map(({ href, icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all duration-150 ${
                  active
                    ? "bg-indigo-bg text-indigo font-medium shadow-[0_0_0_1px_rgba(0,166,126,0.1)]"
                    : "text-slate-light hover:bg-wash hover:text-slate-body"
                }`}
              >
                <DuoIcon icon={icon} active={active} />
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

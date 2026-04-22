"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, ChevronDown, Menu, Shield } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AppHeaderProps {
  onMenuToggle?: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border-card bg-white/90 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={onMenuToggle}
          className="size-8 rounded-md flex items-center justify-center text-slate-muted hover:text-slate-body hover:bg-wash transition-colors"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-indigo flex items-center justify-center">
            <Shield className="size-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[14px] font-semibold text-navy tracking-[-0.02em]">
            WireShield
          </span>
        </div>
      </div>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-1 ml-auto">
        <button className="size-8 rounded-md flex items-center justify-center text-slate-muted hover:text-slate-body hover:bg-wash transition-colors">
          <Search className="size-4" />
        </button>
        <NotificationBell />

        <div className="relative ml-2" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-wash transition-colors"
          >
            <div className="size-7 rounded-full bg-gradient-to-br from-indigo to-[#34D399] text-white flex items-center justify-center text-[11px] font-semibold">
              {initials}
            </div>
            {user && (
              <span className="text-[12px] font-medium text-slate-body hidden sm:block">
                {user.name}
              </span>
            )}
            <ChevronDown className="size-3 text-slate-muted hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl border border-border-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1.5 animate-fade-in-up" style={{ opacity: 1 }}>
              {user && (
                <div className="px-3.5 py-2.5 border-b border-border-subtle">
                  <p className="text-[13px] font-medium text-navy">{user.name}</p>
                  <p className="text-[11px] text-slate-muted">{user.email}</p>
                  <p className="text-[10px] text-indigo font-medium mt-0.5 uppercase tracking-wider">{user.role}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3.5 py-2 text-[13px] text-slate-body hover:bg-wash transition-colors"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

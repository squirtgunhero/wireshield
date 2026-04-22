"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  transaction?: { id: string; propertyAddress: string } | null;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notifications?unread=false");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications?.slice(0, 10) ?? []);
          setUnreadCount(data.unreadCount ?? 0);
        }
      } catch { /* ignore */ }
    }
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative size-8 rounded-lg flex items-center justify-center text-slate-muted hover:text-navy hover:bg-wash transition-all"
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-severity-critical text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[340px] bg-white rounded-xl border border-border-card shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
            <span className="text-[13px] font-semibold text-navy">Notifications</span>
            {unreadCount > 0 && <span className="text-[11px] text-indigo font-medium">{unreadCount} unread</span>}
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-slate-muted">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border-subtle hover:bg-wash transition-colors cursor-pointer ${!n.readAt ? "bg-indigo-bg/30" : ""}`}
                  onClick={() => { if (!n.readAt) markRead(n.id); }}
                >
                  <p className="text-[12px] font-medium text-navy line-clamp-1">{n.title}</p>
                  <p className="text-[11px] text-slate-light mt-0.5 line-clamp-2">{n.body}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-muted">{formatRelativeTime(n.createdAt)}</span>
                    {n.transaction && (
                      <Link href={`/transactions/${n.transaction.id}`} className="text-[10px] text-indigo hover:underline" onClick={(e) => e.stopPropagation()}>
                        {n.transaction.propertyAddress}
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

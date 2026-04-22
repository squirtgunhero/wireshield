"use client";

import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  transaction?: { id: string; propertyAddress: string } | null;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const iv = setInterval(fetch_, 30000);
    return () => clearInterval(iv);
  }, [fetch_]);

  async function markRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  }

  return { notifications, unreadCount, loading, refetch: fetch_, markRead };
}

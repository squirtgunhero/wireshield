"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShieldAlert, Clock, CheckCircle2 } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { DEMO_ALERTS } from "@/lib/seed-data";
import { formatRelativeTime } from "@/lib/utils/format";

interface AlertData {
  id: string;
  severity: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  event?: { id: string; subject: string; severity: string } | null;
}

export default function AlertsPage() {
  const params = useParams();
  const txId = params.id as string;
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transactions/${txId}/risk`);
        if (res.ok) {
          const data = await res.json();
          if (data.alerts?.length > 0) { setAlerts(data.alerts); setLoading(false); return; }
        }
      } catch { /* fallback */ }
      setAlerts(DEMO_ALERTS.map((a) => ({
        id: a.id, severity: a.severity, title: a.title,
        description: a.description, status: a.status, createdAt: a.createdAt,
      })));
      setLoading(false);
    }
    load();
  }, [txId]);

  const sortedAlerts = [...alerts].sort((a, b) => {
    const sev: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, SAFE: 4 };
    return (sev[a.severity] ?? 4) - (sev[b.severity] ?? 4);
  });

  if (loading) return <div className="p-6 text-center text-slate-muted text-[13px]">Loading alerts...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-navy">Alerts</h2>
          <p className="text-[12px] text-slate-light mt-0.5">{alerts.length} active alert{alerts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="space-y-2">
        {sortedAlerts.map((alert) => (
          <div key={alert.id} className={`bg-white rounded-xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all ${alert.severity === "CRITICAL" ? "border-severity-critical/25" : "border-border-card"}`}>
            <div className="flex items-start gap-3.5">
              <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                alert.severity === "CRITICAL" ? "bg-severity-critical-bg"
                  : alert.severity === "HIGH" ? "bg-severity-high-bg" : "bg-wash"
              }`}>
                <ShieldAlert className={`size-[18px] ${
                  alert.severity === "CRITICAL" ? "text-severity-critical"
                    : alert.severity === "HIGH" ? "text-severity-high" : "text-slate-muted"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <SeverityBadge severity={alert.severity} size="default" />
                  <span className="text-[11px] text-slate-muted flex items-center gap-1">
                    <Clock className="size-3" /> {formatRelativeTime(alert.createdAt)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    alert.status === "INVESTIGATING" ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : alert.status === "RESOLVED" ? "bg-severity-safe-bg text-severity-safe border border-severity-safe-border"
                      : "bg-wash text-slate-muted border border-border-card"
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-navy mt-1">{alert.title}</h3>
                <p className="text-[12px] text-slate-light mt-1 leading-relaxed">{alert.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button className="inline-flex h-7 items-center gap-1.5 px-2.5 rounded-md bg-indigo text-white text-[11px] font-medium hover:bg-indigo-light transition-all">
                    <CheckCircle2 className="size-3" /> Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

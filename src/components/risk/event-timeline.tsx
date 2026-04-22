"use client";

import { AlertTriangle, CheckCircle2, Shield, Clock } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { formatRelativeTime } from "@/lib/utils/format";

interface RiskEvent {
  id: string;
  eventType: string;
  severity: string;
  title: string;
  description?: string | null;
  resolved: boolean;
  createdAt: string;
  resolvedBy?: { fullName: string } | null;
}

interface EventTimelineProps {
  events: RiskEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-card p-6 text-center">
        <Shield className="size-8 text-severity-safe mx-auto mb-2" />
        <p className="text-[13px] text-slate-body">No risk events detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div
          key={event.id}
          className={`bg-white rounded-xl border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
            event.severity === "CRITICAL" ? "border-severity-critical/25" : "border-border-card"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
              event.resolved ? "bg-severity-safe-bg" : event.severity === "CRITICAL" ? "bg-severity-critical-bg" : "bg-severity-high-bg"
            }`}>
              {event.resolved ? (
                <CheckCircle2 className="size-4 text-severity-safe" />
              ) : (
                <AlertTriangle className={`size-4 ${event.severity === "CRITICAL" ? "text-severity-critical" : "text-severity-high"}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <SeverityBadge severity={event.severity} size="sm" />
                <span className="text-[11px] text-slate-muted flex items-center gap-1">
                  <Clock className="size-3" /> {formatRelativeTime(event.createdAt)}
                </span>
              </div>
              <p className="text-[13px] font-medium text-navy">{event.title}</p>
              {event.description && <p className="text-[12px] text-slate-light mt-0.5">{event.description}</p>}
              {event.resolved && event.resolvedBy && (
                <p className="text-[11px] text-severity-safe mt-1">Resolved by {event.resolvedBy.fullName}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mail, Banknote, FileText, ShieldCheck, ArrowRightLeft, Cpu, Plus, ScanSearch, ChevronDown, ChevronUp, Fingerprint, Landmark, Brain, Activity } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Monogram } from "@/components/ui/monogram";
import { DEMO_EVENTS, DEMO_PARTIES } from "@/lib/seed-data";
import { formatDateTime } from "@/lib/utils/format";
import { PHASES } from "@/lib/constants";

const TYPE_ICONS: Record<string, typeof Mail> = {
  COMMUNICATION: Mail, WIRE: Banknote, DOCUMENT: FileText,
  VERIFICATION: ShieldCheck, PHASE_CHANGE: ArrowRightLeft,
  IDENTITY_CHECK: Fingerprint, BANK_VALIDATION: Landmark,
  EMAIL_ANALYSIS: Brain, BEHAVIORAL: Activity, SYSTEM: Cpu,
};

type FilterType = "ALL" | "FLAGGED" | "CRITICAL" | "HIGH" | "MEDIUM";

interface EventData {
  id: string;
  phase: string;
  type: string;
  severity: string;
  fromPartyId?: string | null;
  toPartyId?: string | null;
  fromLabel?: string | null;
  fromParty?: { id: string; name: string; role: string } | null;
  toParty?: { id: string; name: string; role: string } | null;
  subject: string;
  detail: string;
  timestamp: string;
  flagged: boolean;
  threatType?: string | null;
  flags?: Array<{ text: string; severity: string }> | null;
  aiSummary?: string | null;
}

export default function TimelinePage() {
  const params = useParams();
  const txId = params.id as string;
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [parties, setParties] = useState<Array<{ id: string; name: string; role: string; email?: string; status?: string }>>([]);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [evtRes, partyRes] = await Promise.all([
          fetch(`/api/transactions/${txId}/timeline`),
          fetch(`/api/transactions/${txId}/parties`),
        ]);
        if (evtRes.ok && partyRes.ok) {
          const { events: e } = await evtRes.json();
          const { parties: p } = await partyRes.json();
          if (e.length > 0) {
            setEvents(e);
            setParties(p);
            setFromDb(true);
            return;
          }
        }
      } catch { /* fallback */ }
      setEvents(DEMO_EVENTS.map((e) => ({
        ...e, fromPartyId: e.fromPartyId ?? null, toPartyId: e.toPartyId ?? null,
        fromLabel: e.fromLabel ?? null, timestamp: e.timestamp,
        aiSummary: e.aiSummary ?? null, threatType: e.threatType ?? null,
        flags: (e.flags as Array<{ text: string; severity: string }>) ?? null,
      })));
      setParties(DEMO_PARTIES.map((p) => ({ id: p.id, name: p.name, role: p.type, email: p.email, status: p.verified ? "VERIFIED" : "INVITED" })));
    }
    load();
  }, [txId]);

  const filtered = events.filter((e) => {
    if (filter === "ALL") return true;
    if (filter === "FLAGGED") return e.flagged;
    return e.severity === filter;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getParty = (id: string | null) => {
    if (!id) return null;
    return parties.find((p) => p.id === id) ?? null;
  };
  const getPhaseLabel = (key: string) => PHASES.find((p) => p.key === key)?.label ?? key;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {(["ALL", "FLAGGED", "CRITICAL", "HIGH", "MEDIUM"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-[5px] rounded-md text-[12px] font-medium transition-all ${filter === f ? "bg-indigo text-white shadow-[0_1px_2px_rgba(0,166,126,0.3)]" : "bg-white border border-border-card text-slate-light hover:text-slate-body hover:bg-wash shadow-[0_1px_2px_rgba(0,0,0,0.04)]"}`}>
              {f === "ALL" ? "All" : f === "FLAGGED" ? "Flagged" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-border-card bg-white text-[12px] font-medium text-slate-body hover:bg-wash shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <ScanSearch className="size-3.5" /> Scan
          </button>
          <button className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-border-card bg-white text-[12px] font-medium text-slate-body hover:bg-wash shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <Plus className="size-3.5" /> Add event
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((event, i) => {
          const Icon = TYPE_ICONS[event.type] ?? Mail;
          const fromParty = fromDb ? event.fromParty : getParty(event.fromPartyId ?? null);
          const toParty = fromDb ? event.toParty : getParty(event.toPartyId ?? null);
          const isExpanded = expandedId === event.id;
          const flags = event.flags;

          return (
            <div
              key={event.id}
              className={`bg-white rounded-xl border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all cursor-pointer animate-fade-in-up ${event.flagged ? "border-severity-critical/25" : "border-border-card hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"}`}
              style={{ opacity: 0, animationDelay: `${i * 0.03}s` }}
              onClick={() => setExpandedId(isExpanded ? null : event.id)}
            >
              <div className="flex items-start gap-3">
                {fromParty ? (
                  <Monogram type={fromParty.role} size="sm" />
                ) : (
                  <div className="size-[30px] rounded-lg bg-wash flex items-center justify-center">
                    <Icon className="size-3.5 text-slate-muted" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[13px] font-medium ${event.flagged ? "text-severity-critical" : "text-navy"}`}>{event.subject}</span>
                    {event.severity !== "SAFE" && event.severity !== "INFO" && <SeverityBadge severity={event.severity} size="sm" />}
                  </div>
                  <p className="text-[12px] text-slate-light line-clamp-2 mb-1">{event.detail}</p>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-muted">
                    <span className="px-1.5 py-px rounded bg-wash font-medium">{getPhaseLabel(event.phase)}</span>
                    {fromParty && <span>From {fromParty.name}</span>}
                    {!fromParty && event.fromLabel && <span className="text-severity-critical font-medium">{event.fromLabel}</span>}
                    {toParty && <span>To {toParty.name}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-slate-muted font-mono">{formatDateTime(event.timestamp)}</span>
                  {isExpanded ? <ChevronUp className="size-3.5 text-slate-muted" /> : <ChevronDown className="size-3.5 text-slate-muted" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border-subtle space-y-3">
                  <p className="text-[13px] text-slate-body whitespace-pre-wrap leading-relaxed">{event.detail}</p>

                  {fromParty && (
                    <div className="flex items-center gap-2 text-[12px]">
                      <Monogram type={fromParty.role} size="sm" />
                      <span className="font-medium text-navy">{fromParty.name}</span>
                    </div>
                  )}

                  {event.flagged && (
                    <div className="rounded-lg border border-severity-critical/15 bg-severity-critical-bg p-4 space-y-3">
                      {event.threatType && <p className="text-[12px] font-semibold text-severity-critical">{event.threatType}</p>}
                      {flags && flags.length > 0 && (
                        <div className="space-y-1.5">
                          {flags.map((flag, fi) => (
                            <div key={fi} className="flex items-start gap-2">
                              <SeverityBadge severity={flag.severity} size="sm" />
                              <span className="text-[12px] text-slate-body">{flag.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {event.aiSummary && (
                        <div>
                          <p className="text-[11px] font-semibold text-navy mb-0.5">AI analysis</p>
                          <p className="text-[12px] text-slate-body leading-relaxed">{event.aiSummary}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileText, ShieldCheck, AlertTriangle, Upload, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { DEMO_DOCUMENTS } from "@/lib/seed-data";

const DOC_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending", SUBMITTED: "Submitted", UNDER_REVIEW: "Under Review",
  VERIFIED: "Verified", FLAGGED: "Flagged", REJECTED: "Rejected",
};

interface DocData {
  id: string;
  name: string;
  phase: string;
  status: string;
  signedAt?: string | null;
  createdAt: string;
}

export default function DocumentsPage() {
  const params = useParams();
  const txId = params.id as string;
  const [documents, setDocuments] = useState<DocData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transactions/${txId}/documents`);
        if (res.ok) {
          const { documents: d } = await res.json();
          if (d.length > 0) { setDocuments(d); setLoading(false); return; }
        }
      } catch { /* fallback */ }
      setDocuments(DEMO_DOCUMENTS.map((d) => ({
        id: d.id, name: d.name, phase: d.phase, status: d.status,
        signedAt: d.signedAt, createdAt: d.signedAt || "2026-01-01",
      })));
      setLoading(false);
    }
    load();
  }, [txId]);

  if (loading) return <div className="p-6 text-center text-slate-muted text-[13px]">Loading documents...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-navy">Documents</h2>
          <p className="text-[12px] text-slate-light mt-0.5">{documents.length} document{documents.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg bg-indigo text-white text-[12px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all">
          <Upload className="size-3.5" /> Upload
        </button>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200">
            <div className="size-9 rounded-lg bg-wash flex items-center justify-center mr-3.5">
              <FileText className="size-[18px] text-slate-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-navy truncate">{doc.name}</p>
              <div className="flex items-center gap-2.5 mt-0.5 text-[11px] text-slate-muted">
                <span className="capitalize">{doc.phase.replace(/_/g, " ").toLowerCase()}</span>
                <span className="size-[3px] rounded-full bg-slate-muted" />
                {doc.signedAt && <span>{formatDate(doc.signedAt)}</span>}
                <span className="size-[3px] rounded-full bg-slate-muted" />
                <span className={doc.status === "VERIFIED" ? "text-severity-safe" : "text-slate-muted"}>
                  {DOC_STATUS_LABELS[doc.status] ?? doc.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 ml-3">
              {doc.status === "VERIFIED" ? (
                <span className="flex items-center gap-0.5 text-severity-safe text-[11px]"><ShieldCheck className="size-3.5" /></span>
              ) : doc.status === "FLAGGED" ? (
                <span className="flex items-center gap-0.5 text-severity-high text-[11px]"><AlertTriangle className="size-3.5" /></span>
              ) : null}
              <button className="size-7 rounded-md flex items-center justify-center text-slate-muted hover:text-navy hover:bg-wash transition-colors">
                <Eye className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

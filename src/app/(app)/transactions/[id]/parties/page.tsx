"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, ShieldAlert, Mail, Phone, Building2, Plus, Loader2 } from "lucide-react";
import { Monogram } from "@/components/ui/monogram";
import { DEMO_PARTIES } from "@/lib/seed-data";

interface Party {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status: string;
  verifiedAt?: string | null;
  user?: { identityVerified?: boolean; identityProvider?: string | null } | null;
}

export default function PartiesPage() {
  const params = useParams();
  const txId = params.id as string;
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", phone: "", role: "BUYER", company: "" });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transactions/${txId}/parties`);
        if (res.ok) {
          const { parties: p } = await res.json();
          if (p.length > 0) { setParties(p); setLoading(false); return; }
        }
      } catch { /* fallback */ }
      setParties(DEMO_PARTIES.map((p) => ({
        id: p.id, name: p.name, role: p.type, email: p.email,
        phone: p.phone, company: p.company, status: p.verified ? "VERIFIED" : "INVITED",
      })));
      setLoading(false);
    }
    load();
  }, [txId]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await fetch(`/api/transactions/${txId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      if (res.ok) {
        const { party } = await res.json();
        setParties((prev) => [...prev, party]);
        setShowInvite(false);
        setInviteForm({ name: "", email: "", phone: "", role: "BUYER", company: "" });
      }
    } catch { /* ignore */ }
    setInviting(false);
  }

  const inputCls = "w-full h-9 rounded-lg border border-border-card bg-white px-3 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all";

  if (loading) return <div className="p-6 text-center text-slate-muted text-[13px]">Loading parties...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-navy">Transaction parties</h2>
          <p className="text-[12px] text-slate-light mt-0.5">{parties.length} parties enrolled</p>
        </div>
        <button onClick={() => setShowInvite(!showInvite)} className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg bg-indigo text-white text-[12px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all">
          <Plus className="size-3.5" /> Add party
        </button>
      </div>

      {showInvite && (
        <form onSubmit={handleInvite} className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder="Full name" required className={inputCls} />
            <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="Email" required className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input value={inviteForm.phone} onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })} placeholder="Phone" className={inputCls} />
            <select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })} className={inputCls}>
              {["BUYER","SELLER","LISTING_AGENT","BUYER_AGENT","TITLE_OFFICER","ESCROW_OFFICER","ATTORNEY","LENDER","OTHER"].map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
              ))}
            </select>
            <input value={inviteForm.company} onChange={(e) => setInviteForm({ ...inviteForm, company: e.target.value })} placeholder="Company" className={inputCls} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={inviting} className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg bg-indigo text-white text-[12px] font-medium hover:bg-indigo-light transition-all disabled:opacity-60">
              {inviting && <Loader2 className="size-3 animate-spin" />} Send invite
            </button>
            <button type="button" onClick={() => setShowInvite(false)} className="h-8 px-3 rounded-lg border border-border-card text-[12px] text-slate-body hover:bg-wash transition-all">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {parties.map((party) => (
          <div key={party.id} className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200">
            <div className="flex items-start gap-3.5">
              <Monogram type={party.role} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] font-semibold text-navy">{party.name}</span>
                  {party.status === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-0.5 text-severity-safe text-[11px] font-medium"><ShieldCheck className="size-3" /></span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-severity-high text-[11px] font-medium"><ShieldAlert className="size-3" /></span>
                  )}
                </div>
                <p className="text-[12px] text-slate-muted capitalize mb-2">{party.role.replace(/_/g, " ").toLowerCase()}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-light">
                    <Mail className="size-3 text-slate-muted" /> {party.email}
                  </div>
                  {party.phone && (
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-light">
                      <Phone className="size-3 text-slate-muted" /> {party.phone}
                    </div>
                  )}
                  {party.company && (
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-light">
                      <Building2 className="size-3 text-slate-muted" /> {party.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

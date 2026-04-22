"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    address: "", city: "", state: "", zip: "",
    contractPrice: "", closingDate: "", transactionType: "PURCHASE",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyAddress: form.address,
          propertyCity: form.city,
          propertyState: form.state,
          propertyZip: form.zip,
          purchasePrice: form.contractPrice ? parseFloat(form.contractPrice.replace(/[,$]/g, "")) : undefined,
          expectedCloseDate: form.closingDate || undefined,
          transactionType: form.transactionType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create transaction");
        setLoading(false);
        return;
      }

      const { transaction } = await res.json();
      router.push(`/transactions/${transaction.id}/timeline`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputCls = "w-full h-10 rounded-lg border border-border-card bg-white px-3 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

  return (
    <div className="p-4 sm:p-6 max-w-[640px]">
      <Link href="/transactions" className="inline-flex items-center gap-1.5 text-[13px] text-slate-muted hover:text-slate-body transition-colors mb-5">
        <ArrowLeft className="size-3.5" /> Back to transactions
      </Link>

      <h1 className="text-[22px] font-semibold text-navy tracking-[-0.03em]">New transaction</h1>
      <p className="text-[13px] text-slate-light mt-0.5 mb-6">Start monitoring a real estate transaction</p>

      {error && (
        <div className="p-3 rounded-lg bg-severity-critical-bg border border-severity-critical-border mb-4">
          <p className="text-[12px] text-severity-critical font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider mb-2">Property details</legend>
          <div>
            <label htmlFor="address" className="block text-[13px] font-medium text-navy mb-1.5">Street address</label>
            <input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main St" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="city" className="block text-[13px] font-medium text-navy mb-1.5">City</label>
            <input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Austin" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="state" className="block text-[13px] font-medium text-navy mb-1.5">State</label>
              <input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="TX" className={inputCls} />
            </div>
            <div>
              <label htmlFor="zip" className="block text-[13px] font-medium text-navy mb-1.5">Zip</label>
              <input id="zip" value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="78701" className={inputCls} />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider mb-2">Transaction details</legend>
          <div>
            <label htmlFor="transactionType" className="block text-[13px] font-medium text-navy mb-1.5">Type</label>
            <select id="transactionType" value={form.transactionType} onChange={(e) => update("transactionType", e.target.value)} className={inputCls}>
              <option value="PURCHASE">Purchase</option>
              <option value="REFINANCE">Refinance</option>
              <option value="SALE">Sale</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="contractPrice" className="block text-[13px] font-medium text-navy mb-1.5">Purchase price</label>
              <input id="contractPrice" value={form.contractPrice} onChange={(e) => update("contractPrice", e.target.value)} placeholder="$450,000" className={inputCls} />
            </div>
            <div>
              <label htmlFor="closingDate" className="block text-[13px] font-medium text-navy mb-1.5">Expected closing</label>
              <input id="closingDate" type="date" value={form.closingDate} onChange={(e) => update("closingDate", e.target.value)} className={inputCls} />
            </div>
          </div>
        </fieldset>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="inline-flex h-10 items-center px-5 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all disabled:opacity-60 gap-2">
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Creating..." : "Create transaction"}
          </button>
          <Link href="/transactions" className="inline-flex h-10 items-center px-5 rounded-lg border border-border-card bg-white text-[13px] font-medium text-slate-body hover:bg-wash shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

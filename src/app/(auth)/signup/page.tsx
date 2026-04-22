"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";

const ROLES = [
  { value: "AGENT", label: "Real Estate Agent" },
  { value: "TITLE_OFFICER", label: "Title Officer" },
  { value: "ESCROW_OFFICER", label: "Escrow Officer" },
  { value: "LENDER", label: "Lender" },
  { value: "ATTORNEY", label: "Attorney" },
  { value: "BUYER", label: "Buyer" },
  { value: "SELLER", label: "Seller" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "AGENT",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone || undefined,
          role: form.role,
          company: form.company || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputCls = "w-full h-10 rounded-lg border border-border-card bg-white px-3 text-[13px] text-navy placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-indigo/25 focus:border-indigo transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

  return (
    <div className="bg-white rounded-2xl border border-border-card p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <h2 className="text-[20px] font-semibold text-navy tracking-[-0.02em] mb-1">Create your account</h2>
      <p className="text-[13px] text-slate-light mb-6">Start protecting your transactions</p>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-severity-critical-bg border border-severity-critical-border mb-4">
          <AlertCircle className="size-4 text-severity-critical shrink-0" />
          <p className="text-[12px] text-severity-critical font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-[13px] font-medium text-navy mb-1.5">First name</label>
            <input id="firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Jane" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-[13px] font-medium text-navy mb-1.5">Last name</label>
            <input id="lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Doe" required className={inputCls} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-navy mb-1.5">Work email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@company.com" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-[13px] font-medium text-navy mb-1.5">Phone <span className="text-slate-muted font-normal">(optional)</span></label>
          <input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} />
        </div>
        <div>
          <label htmlFor="role" className="block text-[13px] font-medium text-navy mb-1.5">Role</label>
          <select id="role" value={form.role} onChange={(e) => update("role", e.target.value)} className={inputCls}>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="company" className="block text-[13px] font-medium text-navy mb-1.5">Company <span className="text-slate-muted font-normal">(optional)</span></label>
          <input id="company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Acme Title Co." className={inputCls} />
        </div>
        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-navy mb-1.5">Password</label>
          <input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 8 characters" required minLength={8} className={inputCls} />
        </div>
        <button type="submit" disabled={loading} className="w-full h-10 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-[12px] text-slate-muted text-center mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

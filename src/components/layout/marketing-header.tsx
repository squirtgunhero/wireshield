"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(246,245,240,0.82)] backdrop-blur-[14px] backdrop-saturate-[1.6] border-b border-[#EEF1EE]">
      <div className="mx-auto max-w-[1200px] flex h-[68px] items-center justify-between px-8 max-[720px]:px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-[28px] h-[28px] grid place-items-center rounded-[8px] relative overflow-hidden" style={{
            background: "linear-gradient(145deg, #0E7C66, #065E4C)",
            boxShadow: "0 2px 6px rgba(14,124,102,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" fill="rgba(255,255,255,0.18)"/>
              <path d="M12 2L4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" stroke="white" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8"/>
            </svg>
          </span>
          <span className="font-display text-xl font-semibold text-[#0B1F1C] tracking-[-0.01em]">
            WireShield
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm text-[#3D5753] hover:text-[#0B1F1C] transition-colors">Features</Link>
          <Link href="/#how" className="text-sm text-[#3D5753] hover:text-[#0B1F1C] transition-colors">How it works</Link>
          <Link href="#" className="text-sm text-[#3D5753] hover:text-[#0B1F1C] transition-colors">Customers</Link>
          <Link href="#" className="text-sm text-[#3D5753] hover:text-[#0B1F1C] transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm text-[#3D5753] hover:text-[#0B1F1C] transition-colors">Sign in</Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#0B1F1C] text-[#F6F5F0] text-sm font-medium shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_1px_2px_rgba(11,31,28,0.18)] hover:-translate-y-px hover:bg-black transition-all"
          >
            Get started
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10m-4-4 4 4-4 4"/></svg>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="size-8 rounded-md flex items-center justify-center text-[#3D5753] hover:text-[#0B1F1C] hover:bg-[rgba(11,31,28,0.04)] md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#EEF1EE] bg-[#F6F5F0] px-5 py-3 space-y-1">
          <Link href="/#features" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#1A2E2A] hover:bg-[rgba(11,31,28,0.04)] transition-colors">Features</Link>
          <Link href="/#how" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#1A2E2A] hover:bg-[rgba(11,31,28,0.04)] transition-colors">How it works</Link>
          <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#1A2E2A] hover:bg-[rgba(11,31,28,0.04)] transition-colors">Sign in</Link>
          <Link href="/signup" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-md bg-[#0B1F1C] text-[#F6F5F0] text-sm font-medium text-center mt-2">Get started</Link>
        </div>
      )}
    </nav>
  );
}

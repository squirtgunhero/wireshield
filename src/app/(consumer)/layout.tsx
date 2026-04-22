import { Shield } from "lucide-react";
import Link from "next/link";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-wash">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border-card bg-white/90 backdrop-blur-md px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-indigo flex items-center justify-center">
            <Shield className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold text-navy tracking-[-0.02em]">WireShield</span>
        </Link>
        <Link href="/login" className="text-[13px] text-slate-body hover:text-navy transition-colors">Sign in</Link>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">{children}</main>
    </div>
  );
}

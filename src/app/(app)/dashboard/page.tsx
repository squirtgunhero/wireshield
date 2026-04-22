import { LayoutDashboard, ShieldAlert, Users, ScanSearch, Plus, Crosshair, GraduationCap } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { TxCard } from "@/components/transaction/tx-card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { prisma } from "@/lib/db";
import { formatRelativeTime } from "@/lib/utils/format";
import { DEMO_TRANSACTION, DEMO_PARTIES, DEMO_ALERTS } from "@/lib/seed-data";

async function getData() {
  try {
    const [transactions, alertCount, partyCount, eventCount] = await Promise.all([
      prisma.transaction.findMany({
        where: { status: "ACTIVE" },
        include: {
          parties: { select: { id: true, name: true, role: true, status: true } },
          _count: { select: { alerts: true, wireInstructions: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.alert.count({ where: { status: { in: ["ACTIVE", "INVESTIGATING"] } } }),
      prisma.transactionParty.count({ where: { status: "VERIFIED" } }),
      prisma.event.count(),
    ]);

    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { transaction: { select: { id: true } } },
    });

    return { transactions, alertCount, partyCount, eventCount, alerts, fromDb: true };
  } catch {
    return { transactions: [], alertCount: 0, partyCount: 0, eventCount: 0, alerts: [], fromDb: false };
  }
}

export default async function DashboardPage() {
  const { transactions, alertCount, partyCount, eventCount, alerts, fromDb } = await getData();

  const txCards = fromDb && transactions.length > 0
    ? transactions.map((tx) => ({
        id: tx.id,
        displayId: tx.id.slice(0, 8).toUpperCase(),
        address: tx.propertyAddress,
        city: tx.propertyCity ?? "",
        state: tx.propertyState ?? "",
        currentPhase: tx.currentPhase,
        closingDate: tx.expectedCloseDate?.toISOString() ?? null,
        contractPrice: tx.purchasePrice ? Number(tx.purchasePrice) : null,
        alertCount: tx._count.alerts,
        partyCount: tx.parties.length,
      }))
    : [{
        id: DEMO_TRANSACTION.id,
        displayId: DEMO_TRANSACTION.displayId,
        address: DEMO_TRANSACTION.propertyAddress,
        city: DEMO_TRANSACTION.propertyCity,
        state: DEMO_TRANSACTION.propertyState,
        currentPhase: DEMO_TRANSACTION.currentPhase,
        closingDate: DEMO_TRANSACTION.closingDate,
        contractPrice: DEMO_TRANSACTION.contractPrice,
        alertCount: DEMO_ALERTS.length,
        partyCount: DEMO_PARTIES.length,
      }];

  const displayAlerts = fromDb && alerts.length > 0
    ? alerts.map((a) => ({
        id: a.id, severity: a.severity, title: a.title,
        description: a.description, createdAt: a.createdAt.toISOString(),
        txId: a.transaction?.id,
      }))
    : DEMO_ALERTS.map((a) => ({
        id: a.id, severity: a.severity, title: a.title,
        description: a.description, createdAt: a.createdAt,
        txId: DEMO_TRANSACTION.id,
      }));

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-[1120px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-semibold text-navy tracking-[-0.03em]">Dashboard</h1>
          <p className="text-[13px] text-slate-light mt-0.5">Overview of your monitored transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/scan" className="inline-flex h-9 items-center gap-2 px-3.5 rounded-lg border border-border-card bg-white text-[13px] font-medium text-slate-body hover:bg-wash shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <Crosshair className="size-[14px]" /> Scan
          </Link>
          <Link href="/transactions/new" className="inline-flex h-9 items-center gap-2 px-3.5 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all">
            <Plus className="size-[14px]" /> New transaction
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Transactions" value={fromDb ? transactions.length : 1} icon={LayoutDashboard} />
        <StatCard label="Active alerts" value={fromDb ? alertCount : DEMO_ALERTS.length} icon={ShieldAlert} />
        <StatCard label="Verified parties" value={fromDb ? partyCount : DEMO_PARTIES.filter(p => p.verified).length} icon={Users} />
        <StatCard label="Scanned" value={fromDb ? eventCount : 14} icon={ScanSearch} />
      </div>

      <div>
        <h2 className="text-[15px] font-semibold text-navy mb-3">Active transactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {txCards.map((tx) => (
            <TxCard key={tx.id} {...tx} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-[15px] font-semibold text-navy mb-3">Recent alerts</h2>
          <div className="space-y-2">
            {displayAlerts.map((alert, i) => (
              <Link
                key={alert.id}
                href={`/transactions/${alert.txId}/alerts`}
                className={`block bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 animate-fade-in-up stagger-${i + 1}`}
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <SeverityBadge severity={alert.severity} size="sm" />
                  <span className="text-[11px] text-slate-muted font-mono">{formatRelativeTime(alert.createdAt)}</span>
                </div>
                <p className="text-[13px] font-medium text-navy">{alert.title}</p>
                <p className="text-[12px] text-slate-light mt-0.5 line-clamp-1">{alert.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-navy mb-3">Quick actions</h2>
          <div className="space-y-2">
            {[
              { href: "/transactions/new", icon: Plus, label: "New transaction", desc: "Start monitoring a real estate transaction", color: "text-indigo", bg: "bg-indigo-bg" },
              { href: "/scan", icon: ScanSearch, label: "Scan communication", desc: "Analyze an email or message for threats", color: "text-indigo", bg: "bg-indigo-bg" },
              { href: "/training", icon: GraduationCap, label: "Training scenarios", desc: "Practice identifying fraud attempts", color: "text-indigo", bg: "bg-indigo-bg" },
            ].map(({ href, icon: Icon, label, desc, color, bg }) => (
              <Link key={href} href={href} className="flex items-center gap-3.5 bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200">
                <div className={`size-9 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`size-[18px] ${color}`} />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-navy">{label}</p>
                  <p className="text-[12px] text-slate-light">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
